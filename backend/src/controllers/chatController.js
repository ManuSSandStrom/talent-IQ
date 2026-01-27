import OpenAI from "openai";
import { ENV } from "../lib/env.js";
import { streamClient } from "../lib/stream.js";

const openai = new OpenAI({
  apiKey: ENV.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export const getStreamToken = async (req, res) => {
  try {
    const { clerkId, name, profileImage } = req.user; // from protectRoute middleware

    if (!clerkId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const token = streamClient.createToken(clerkId);

    res.status(200).json({
      token,
      userId: clerkId,
      userName: name,
      userImage: profileImage,
    });
  } catch (error) {
    console.error("Error generating stream token:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const chatWithAI = async (req, res) => {
  try {
    const { messages } = req.body;

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-lite-preview-02-05:free", // Free model via OpenRouter
      messages: [
        { role: "system", content: "You are a helpful coding assistant. Keep responses concise and helpful for technical interviews." },
        ...messages
      ],
    });

    res.json(completion.choices[0].message);
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ message: "Failed to generate response" });
  }
};