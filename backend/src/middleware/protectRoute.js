import { clerkClient } from "@clerk/express";
import User from "../models/User.js";
import { upsertStreamUser } from "../lib/stream.js";

export const protectRoute = async (req, res, next) => {
  try {
    // Get auth object - In Clerk Express v5+, req.auth is a function
    const auth = typeof req.auth === 'function' ? req.auth() : req.auth;
    
    if (!auth) {
      return res.status(401).json({ message: "Unauthorized - Auth missing" });
    }

    const { userId } = auth;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - No Clerk ID" });
    }

    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      // Auto-sync: Create user in DB if they don't exist (Self-healing)
      const clerkUser = await clerkClient.users.getUser(userId);
      
      const email = clerkUser.emailAddresses?.[0]?.emailAddress || "";
      const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "User";
      const profileImage = clerkUser.imageUrl || "";

      user = await User.create({
        clerkId: userId,
        name,
        email,
        profileImage,
      });

      // Ensure user exists in Stream for video calls
      try {
        await upsertStreamUser({
          id: userId,
          name: user.name,
          image: user.profileImage,
        });
      } catch (streamError) {
        // Log but don't fail the request if stream sync fails (non-fatal for auth)
        console.error("Stream sync failed during auth (non-fatal):", streamError.message);
      }
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};