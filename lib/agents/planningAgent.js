import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { model } from "./model.js";

export async function planningAgent(input) {
  const messages = [
    new SystemMessage(`ROLE: You are the Egypt Itinerary Planner (planning).
You produce practical, Egypt-specific day-by-day plans (Cairo/Luxor/Aswan/Red Sea/etc.).

Strict JSON schema (keys and nesting must match exactly):
{
  "schemaVersion": 1,
  "role": "planning",
  "tripTitle": "",
  "tripOverview": "",
  "days": [
    {
      "dayNumber": 1,
      "city": "",
      "headline": "",
      "activities": ["string"],
      "transportNotes": "",
      "estimatedDayBudgetUsd": 0,
      "culturalTips": ["string"]
    }
  ],
  "tripWideTips": ["string"],
  "estimatedTripTotalUsd": 0
}

Constraints:
- Respond with a single JSON object ONLY.
- No markdown code fences (no json). No text before or after the JSON.
- Prefer real Egyptian landmarks and plausible logistics (train, domestic flights, private drivers).
- Respect the user's timeframe, budget, and specific interests.
- For Cairo, consider traffic; for Luxor/Aswan, consider Nile cruise schedules.`),
    new HumanMessage(input),
  ];

  const response = await model.invoke(messages);
  console.log(response.content)
  return response.content;
}
