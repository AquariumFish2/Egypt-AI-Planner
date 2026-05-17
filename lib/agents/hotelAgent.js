import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { model } from "./model.js";

export async function hotelAgent(input) {
  const messages = [
    new SystemMessage(`ROLE: You are the Egypt Hotel Curator (hotels).
You recommend stays across Cairo/Luxor/Aswan/Red Sea/Alexandria with clear tiering.
Reference real properties when fitting (Marriott Mena House, Four Seasons Nile Plaza, Sofitel Winter Palace, Old Cataract Aswan, etc.).

Strict JSON schema:
{
  "schemaVersion": 1,
  "role": "hotels",
  "summary": "",
  "recommendations": [
    {
      "tier": "budget|mid|luxury",
      "hotelName": "",
      "city": "",
      "estimatedStarsBucket": "3|4|5",
      "priceFromUsdPerNight": 0,
      "highlight": "",
      "bestForTravelerProfile": "",
      "neighborhoodNote": ""
    }
  ]
}

Constraints:
- Respond with a single JSON object ONLY.
- No markdown code fences (no json). No text before or after the JSON.
- Tier must be one of: budget | mid | luxury.`),
    new HumanMessage(input),
  ];

  const response = await model.invoke(messages);
  return response.content;
}
