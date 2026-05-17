/**
 * AgentResponseRouter
 * Dispatches to the specialist output component that matches the agent role and schema.
 */

"use client";

import PlanningOutputCard from "@/components/output/PlanningOutputCard.jsx";
import ReviewsOutputCard from "@/components/output/ReviewsOutputCard.jsx";
import FlightsOutputCard from "@/components/output/FlightsOutputCard.jsx";
import HotelsOutputCard from "@/components/output/HotelsOutputCard.jsx";

const SYMBOLS = {
  planning: "𓅓",
  reviews: "𓆣",
  flights: "𓁹",
  hotels: "𓏤",
};

export default function AgentResponseRouter({
  agentName,
  status,
  index,
  structured,
  rawOutput,
  parseOk,
}) {
  const symbol = SYMBOLS[agentName] || "𓂀";
  const props = {
    agentName,
    symbol,
    status,
    index,
    structured,
    rawOutput: rawOutput || "",
    parseOk: !!parseOk,
  };

  switch (agentName) {
    case "planning":
      return <PlanningOutputCard {...props} />;
    case "reviews":
      return <ReviewsOutputCard {...props} />;
    case "flights":
      return <FlightsOutputCard {...props} />;
    case "hotels":
      return <HotelsOutputCard {...props} />;
    default:
      return null;
  }
}
