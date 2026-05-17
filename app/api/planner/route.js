/**
 * Planner API Route
 * POST handler: internal supervisor selects specialists; response is structured JSON only
 * (parsed server-side). Supervisor routing text is never returned to clients.
 */

import { NextResponse } from "next/server";
import { supervisorOrchestrator } from "@/lib/agents/supervisor.js";
import { safeJsonParse } from "@/lib/agents/jsonUtils.js";


export async function POST(req) {
  try {
    const body = await req.json();
    const { userQuery, tab } = body;

    console.log("Planner API: request received", { tab });

    if (!userQuery) {
      console.warn("Planner API: missing userQuery");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("Planner API: OPENAI_API_KEY is not set");
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not set on the server" },
        { status: 500 }
      );
    }

    const startTime = Date.now();
    const specialistRaw = await supervisorOrchestrator(userQuery, tab);
    const totalDuration = Date.now() - startTime;

    const enriched = specialistRaw.map((r) => {
      const rawStr =
        typeof r.output === "string" ? r.output : String(r.output ?? "");
      const parsed = safeJsonParse(rawStr);
      const structured =
        parsed && typeof parsed === "object" && !Array.isArray(parsed)
          ? parsed
          : null;
      return {
        agentName: r.agentName,
        duration: r.duration,
        rawOutput: rawStr,
        structured,
        parseOk: !!structured,
      };
    });

    return NextResponse.json({
      responses: enriched,
      totalDuration,
    });
  } catch (error) {
    console.error("Planner API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
