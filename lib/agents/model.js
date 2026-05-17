import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = "gemini-2.5-flash";

const genai = new GoogleGenAI({});

/**
 * Thin LangChain-compatible wrapper around @google/genai.
 * Supports model.invoke([SystemMessage, HumanMessage, ...]) calls
 * used by all specialist agents and the supervisor.
 */
export const model = {
  async invoke(messages) {
    // Separate system messages from human/AI turns
    const systemParts = messages
      .filter((m) => m._getType?.() === "system" || m.constructor?.name === "SystemMessage")
      .map((m) => m.content)
      .join("\n\n");

    const isSystem = (m) =>
      m._getType?.() === "system" || m.constructor?.name === "SystemMessage";

    const contents = messages
      .filter((m) => !isSystem(m))
      .map((m) => ({
        role: m._getType?.() === "ai" || m.constructor?.name === "AIMessage" ? "model" : "user",
        parts: [{ text: String(m.content) }],
      }));

    const config = systemParts ? { systemInstruction: systemParts } : {};

    const response = await genai.models.generateContent({
      model: MODEL_NAME,
      contents,
      config,
    });

    return { content: response.text ?? "" };
  },
};

