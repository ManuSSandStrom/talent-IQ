import { chatClient, streamClient, upsertStreamUser } from "../lib/stream.js";
import Session from "../models/Session.js";

export async function createSession(req, res) {
  try {
    const { problem, difficulty } = req.body;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    if (!clerkId) {
      return res.status(400).json({ message: "User is not authenticated properly (missing clerkId)" });
    }

    if (!problem || !difficulty) {
      return res.status(400).json({ message: "Problem and difficulty are required" });
    }

    // generate a unique call id for stream video
    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Ensure user is synced to Stream before creating resources
    try {
      await upsertStreamUser({
        id: clerkId,
        name: req.user.name,
        image: req.user.profileImage,
      });
    } catch (error) {
      console.error("Failed to sync user to Stream:", error);
      return res.status(500).json({ message: `Failed to sync user with video service: ${error.message}` });
    }

    // create session in db
    const session = await Session.create({ problem, difficulty, host: userId, callId });

    try {
      // create stream video call
      await streamClient.video.call("default", callId).getOrCreate({
        data: {
          created_by_id: clerkId,
          custom: { problem, difficulty, sessionId: session._id.toString() },
        },
      });

      // chat messaging
      const channel = chatClient.channel("messaging", callId, {
        name: `${problem} Session`,
        created_by_id: clerkId,
        members: [clerkId],
      });

      await channel.create();
    } catch (error) {
      // If stream creation fails, delete the session from DB to prevent ghost sessions
      console.error("Stream creation failed, deleting session:", error);
      await Session.findByIdAndDelete(session._id);
      throw error;
    }

    res.status(201).json({ session });
  } catch (error) {
    console.error("Error in createSession controller:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
}

export async function getActiveSessions(_, res) {
  try {
    const sessions = await Session.find({ status: "active" })
      .populate("host", "name profileImage email clerkId")
      .populate("participant", "name profileImage email clerkId")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.error("Error in getActiveSessions controller:", error);
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
}

export async function getMyRecentSessions(req, res) {
  try {
    const userId = req.user._id;

    // get sessions where user is either host or participant
    const sessions = await Session.find({
      status: "completed",
      $or: [{ host: userId }, { participant: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.error("Error in getMyRecentSessions controller:", error);
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
}

export async function getSessionById(req, res) {
  try {
    const { id } = req.params;

    const session = await Session.findById(id)
      .populate("host", "name email profileImage clerkId")
      .populate("participant", "name email profileImage clerkId");

    if (!session) return res.status(404).json({ message: "Session not found" });

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in getSessionById controller:", error.message);
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
}

export async function joinSession(req, res) {
  try {
    const { id } = req.params;
    const { guestName } = req.body; // Expect guestName if not logged in
    
    // Check if user is authenticated (might be attached by clerkMiddleware if present, 
    // but we removed protectRoute, so we need to manually check req.auth or similar if we want to support both)
    // Actually, clerkMiddleware always runs. So req.auth might be there.
    // Let's rely on req.user which is usually populated by protectRoute.
    // Since we removed protectRoute, req.user won't be there unless we add logic to fetch it if auth exists.
    // BETTER APPROACH: Check req.auth (from Clerk) and fetch user if exists.
    
    // However, for simplicity and speed:
    // If client sends a token, Clerk middleware processes it. 
    // But we need to implement "get user from DB" logic here if we want to support logged-in joining.
    // Let's assume for now: if user is logged in, the frontend sends the token. 
    // If we removed protectRoute, we don't have the user object in req.user.
    // We should probably check `req.auth.userId` (Clerk ID) and fetch user.
    
    // Let's try to keep it simple:
    // We will verify if we can satisfy the request as a GUEST first.
    
    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.status !== "active") {
      return res.status(400).json({ message: "Cannot join a completed session" });
    }

    // CHECK IF SESSION IS FULL
    // Full if: (participant IS SET) OR (guestId IS SET)
    if (session.participant || session.guestId) {
       return res.status(409).json({ message: "Session is full" });
    }

    let userId, clerkId, userName, userImage;
    let isGuest = true;

    // Check if request has authenticated user data (manually handled since we removed protectRoute)
    // We can rely on req.body.userId if we trust the client? NO.
    // We will accept `guestName` for guests.
    // If the frontend is logged in, it should probably call a DIFFERENT endpoint? 
    // Or we handle both here.
    
    // To support "No security", let's prioritize the Guest flow if guestName is provided.
    if (guestName) {
      isGuest = true;
      userId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      clerkId = userId;
      userName = guestName;
      userImage = `https://ui-avatars.com/api/?name=${guestName}&background=random`;
    } else {
       // If no guestName, maybe they are trying to join as authenticated user?
       // Since protectRoute is gone, we'd need to manually decode/verify. 
       // ERROR: If we removed protectRoute, req.user is undefined. 
       // The cleanest way is to require `guestName` for EVERYONE who hits this public endpoint for now, 
       // OR re-add protectRoute but make it non-blocking (middleware modification).
       
       // Given the user constraint "no security nothing", let's assume EVERYONE joins as a "Guest" 
       // effectively, or we treat them as such if they don't provide a token.
       
       // actually, the user said "login and then directly come". 
       // So we DO need to support logged in users.
       
       // Re-implementing a mini-protectRoute here:
       // The clerkMiddleware still runs on all routes (in server.js).
       // So `req.auth` should be available.
       if (req.auth && req.auth.userId) {
          // User is logged in with Clerk
          isGuest = false;
          clerkId = req.auth.userId;
          // specific import needed if we want to query User model
          // We need to import User model
          const User = (await import("../models/User.js")).default; 
          const user = await User.findOne({ clerkId });
          if (user) {
             userId = user._id;
             userName = user.name;
             userImage = user.profileImage;
             
             // Host check
             if (session.host.toString() === userId.toString()) {
                 // It is the host joining (re-joining)
                 // We do nothing explicitly specific here, just ensure we don't set them as 'participant' later
             } else if (session.participant && session.participant.toString() === userId.toString()) {
                 // User is already the participant, allow re-join
             } else if (session.participant) {
                 return res.status(409).json({ message: "Session is full (Participant slot taken)" });
             } 
          } else {
             return res.status(404).json({ message: "User not found" });
          }
       } else {
          return res.status(400).json({ message: "Guest name is required" });
       }
    }

    // Upsert to Stream
    try {
      await upsertStreamUser({
        id: clerkId,
        name: userName,
        image: userImage,
      });
    } catch (error) {
      console.error("Failed to sync user to Stream:", error);
      return res.status(500).json({ message: `Failed to sync user with video service: ${error.message}` });
    }

    // Save to Session
    if (isGuest) {
      // If guestId is already set and different, check if full? 
      // Current logic: session.guestId check was done at top.
      // If this is a NEW guest, set it.
      // If re-joining guest, just update?
      session.guestId = clerkId;
      session.guestName = userName;
      // Only set waiting if not already set (preserve admitted status if re-joining)
      if (!session.guestStatus) session.guestStatus = "waiting"; 
    } else {
      // Authenticated User
      // Only set participant if it's NOT the host
      if (session.host.toString() !== userId.toString()) {
         session.participant = userId;
      }
    }

    await session.save();
    
    // Add member to chat channel
    const channel = chatClient.channel("messaging", session.callId);
    await channel.addMembers([clerkId]);

    // Generate Stream Token
    const token = streamClient.createToken(clerkId);

    // Return the user identifiers so the frontend can use them
    res.status(200).json({ 
       session,
       token, 
       joinedAs: { 
          id: clerkId, 
          name: userName, 
          image: userImage,
          isGuest 
       } 
    });
  } catch (error) {
    console.log("Error in joinSession controller:", error.message);
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
}

export async function endSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { code } = req.body;

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    // check if user is the host
    if (session.host.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only the host can end the session" });
    }

    // check if session is already completed
    if (session.status === "completed") {
      return res.status(400).json({ message: "Session is already completed" });
    }

    // delete stream video call
    const call = streamClient.video.call("default", session.callId);
    await call.delete({ hard: true });

    // delete stream chat channel
    const channel = chatClient.channel("messaging", session.callId);
    await channel.delete();

    session.status = "completed";
    session.code = code;
    await session.save();

    res.status(200).json({ session, message: "Session ended successfully" });
  } catch (error) {
    console.log("Error in endSession controller:", error.message);
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
}

// Admit waiting guest
export const admitGuest = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id.toString(); // Use DB ID, not Clerk ID

        const session = await Session.findById(id);
        if (!session) return res.status(404).json({ message: "Session not found" });

        // Verify Host
        if (session.host.toString() !== userId) {
            return res.status(403).json({ message: "Only host can admit guests" });
        }

        if (session.guestStatus !== "waiting") {
            return res.status(400).json({ message: "Guest is not waiting or already admitted" });
        }

        session.guestStatus = "admitted";
        await session.save();

        res.status(200).json({ message: "Guest admitted successfully" });
    } catch (error) {
        console.error("Error in admitGuest controller:", error);
        res.status(500).json({ message: `Internal Server Error: ${error.message}` });
    }
}

export const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id.toString(); // Use DB ID, not Clerk ID

    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.host.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this session" });
    }

    await Session.findByIdAndDelete(id);

    res.status(200).json({ message: "Session deleted successfully" });
  } catch (error) {
    console.log("Error in deleteSession controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
