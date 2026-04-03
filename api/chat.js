import OpenAI from "openai";

export const config = {
  runtime: "nodejs"
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await openai.responses.create({
      model: "gpt-5-mini",
      input: [
        {
          role: "user",
          content: message
        }
      ]
    });

    const reply = response.output_text || "No reply from AI";

    return res.status(200).json({ reply });

  } catch (err) {
    console.error("FULL ERROR:", err);
    return res.status(500).json({
      reply: "Backend error",
      error: err.message
    });
  }
}
