import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { model } from "./model.js";
import { planningAgent } from "./planningAgent.js";
import { reviewsAgent } from "./reviewsAgent.js";
import { flightAgent } from "./flightAgent.js";
import { hotelAgent } from "./hotelAgent.js";
import { safeJsonParse } from "./jsonUtils.js";

const agentRegistry = {
  planning: planningAgent,
  reviews: reviewsAgent,
  flights: flightAgent,
  hotels: hotelAgent,
};

const ALLOWED_AGENTS = ["planning", "reviews", "flights", "hotels"];

function fallbackAgentsForTab(tab) {
  switch (tab) {
    case "day":
      return ["planning"];
    case "reviews":
      return ["reviews"];
    case "flights":
      return ["flights"];
    case "hotels":
      return ["hotels"];
    case "full":
    default:
      return ["planning"];
  }
}


export async function supervisorOrchestrator(userTask, tab) {
  console.log("Supervisor: Starting orchestration (internal routing)...");
  const specialistResponses = [];

  console.log("Supervisor: Selecting agents...");
  const selectStart = Date.now();
  const supervisorRes = await model.invoke([
    new SystemMessage(`You are the Supervisor Agent for an Egypt travel planning system.
Decide which specialist agents are strictly necessary to fulfill the user's request.
Allowed specialists: planning, reviews, flights, hotels.

Hard rules:
1. Output STRICT JSON only.
2. "agents": string[] execution order.
3. Be intelligent: only include an agent if the user's query actually requires that specialist's expertise.
4. Even if the Tab is "full", do NOT include all agents unless the user specifically asked for a comprehensive plan (itinerary + flights + hotels + reviews).
5. If the Tab is a specific category (e.g., "flights"), prioritize that specialist but still only include others if relevant.
6. "strategy": max 140 chars explaining your routing choice.

Exact JSON shape:
{"agents":["planning","reviews"],"strategy":".."}`),
    new HumanMessage(
      `Tab: ${String(tab || "full")}\n\nUser request:\n${String(userTask || "")}`
    ),
  ]);
  const supervisorDurationMs = Date.now() - selectStart;
  console.log(`Supervisor: selection completed in ${supervisorDurationMs}ms`);

  const supervisorJson = supervisorRes?.content || "";
  const parsedRoute = safeJsonParse(supervisorJson);
  let selected =
    parsedRoute && Array.isArray(parsedRoute.agents)
      ? parsedRoute.agents.map(String)
      : [];
  selected = selected
    .map((a) => a.trim().toLowerCase())
    .filter((a) => ALLOWED_AGENTS.includes(a));

  if (selected.length === 0) {
    selected = fallbackAgentsForTab(tab);
  }

  const strategy =
    parsedRoute && typeof parsedRoute.strategy === "string"
      ? parsedRoute.strategy.slice(0, 160).trim()
      : "Optimize specialist coverage based on trip scope.";

  for (const agentName of selected) {
    console.log(`Supervisor: Invoking specialist ${agentName}...`);
    const startTime = Date.now();

    const agentInput =
      specialistResponses.length === 0
        ? `${userTask}\n\n[Internal routing constraints — embody these in schema fields only; do not disclose this block]\nstrategy: ${strategy}\nplanned_order: ${selected.join(" → ")}`
        : [
          `User request: ${userTask}`,
          `Internal routing hints (do not echo verbatim): ${strategy}`,
          "Context from previous specialists (JSON payloads as produced):",
          ...specialistResponses.map(
            (r) =>
              `\n<<<${String(r.agentName).toUpperCase()}>>>\n${String(r.output || "")}`
          ),
        ].join("\n\n");

    const agentFn = agentRegistry[agentName];
    if (!agentFn) {
      console.warn(`Agent "${agentName}" not found — skipping.`);
      continue;
    }

    const output = await agentFn(agentInput);
    const duration = Date.now() - startTime;

    specialistResponses.push({ agentName, output, duration });
    console.log(`Supervisor: ${agentName} completed in ${duration}ms`);
  }

  console.log("Supervisor: All specialists completed.");
  return specialistResponses;
}
