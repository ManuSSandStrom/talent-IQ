import { StreamChat } from "stream-chat";
import { StreamClient } from "@stream-io/node-sdk";
import { ENV } from "./env.js";

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  throw new Error("STREAM_API_KEY or STREAM_API_SECRET is missing in environment variables");
}

export const chatClient = StreamChat.getInstance(apiKey, apiSecret); // will be used chat features
export const streamClient = new StreamClient(apiKey, apiSecret); // will be used for video calls

export const upsertStreamUser = async (userData) => {
  try {
    if (!userData.id) {
      throw new Error("Missing user ID for Stream sync");
    }

    // 1. Sync with Chat Service
    await chatClient.upsertUser(userData);

    // 2. Sync with Video Service (Explicitly required for calls sometimes)
    const videoUser = {
      id: userData.id,
      name: userData.name || "User",
      image: userData.image || "",
      role: "user",
    };
    await streamClient.upsertUsers([videoUser]);

    console.log("Stream user upserted successfully:", userData.id);
  } catch (error) {
    console.error("Error upserting Stream user:", error);
    // Throw error so the caller knows sync failed
    throw new Error(`Stream sync failed: ${error.message}`);
  }
};

export const deleteStreamUser = async (userId) => {
  try {
    await chatClient.deleteUser(userId);
    console.log("Stream user deleted successfully:", userId);
  } catch (error) {
    console.error("Error deleting the Stream user:", error);
  }
};
