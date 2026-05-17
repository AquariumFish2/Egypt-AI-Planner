import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { model } from "./model.js";

export async function flightAgent(input) {
  const messages = [
    new SystemMessage(`ROLE: You are the Egypt Flight Options Strategist (flights).
You compare realistic routings into Egypt (CAI/LXR/ASW/SSH) with plausible carriers and price bands.

Strict JSON schema:
{
  "schemaVersion": 1,
  "role": "flights",
  "preferredOrigin": "",
  "targetAirportsEgypt": ["CAI"],
  "options": [
    {
      "airline": "",
      "route": "",
      "approximateLowPriceUsd": 0,
      "approximateHighPriceUsd": 0,
      "durationHoursTotal": 0,
      "stops": 0,
      "stopoverSummary": "",
      "bookingAdvice": ""
    }
  ],
  "recommendation": ""
}

Constraints:
- Respond with a single JSON object ONLY.
- No markdown code fences (no json). No text before or after the JSON.
- Use integers for stops; use numbers for hours and USD fields; use null if unknown.`),
    new HumanMessage(input),
  ];

  const response = await model.invoke(messages);
  return response.content;
}
