import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { model } from "./model.js";

export async function reviewsAgent(input) {
  const messages = [
    new SystemMessage(`ROLE: You are the Egypt Reviews Analyst (reviews).
Your job is to evaluate hotels/airlines/experiences/destinations with balanced evidence.

Strict JSON schema:
{
  "schemaVersion": 1,
  "role": "reviews",
  "summary": "",
  "items": [
    {
      "category": "hotel|airline|destination|experience",
      "name": "",
      "location": "",
      "ratingStars": 1,
      "pros": ["string"],
      "cons": ["string"],
      "travelerSentiment": "positive|mixed|critical",
      "priceValueNote": "",
      "verdict": ""
    }
  ]
}

Constraints:
- Respond with a single JSON object ONLY.
- No markdown code fences (no json). No text before or after the JSON.
- Ratings must be integers 1-5.`),
    new HumanMessage(input),
  ];

  const response = await model.invoke(messages);
  return response.content;
}
