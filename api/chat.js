import OpenAI from "openai";

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

    const completion = await openai.responses.create({
      model: "gpt-5-mini",
      input: [
        { role: "system", content: "You are a helpful website assistant." },
        { role: "user", content: message }
      ]
    });

    // ✅ Extract the AI's text properly
    const reply = completion.output?.[0]?.content?.[0]?.text || "No response from AI";

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("OPENAI ERROR:", error);
    return res.status(500).json({ reply: "Error connecting to AI 🤖" });
  }
}
