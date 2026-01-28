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
    const { guestName } = req.body; 
    
    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.status !== "active") {
      return res.status(400).json({ message: "Cannot join a completed session" });
    }

    // Check if session slot is available
    if (session.participant || session.guestId) {
       return res.status(409).json({ message: "Session is full" });
    }

    let userId, clerkId, userName, userImage;
    let isGuest = true;

    // Handle Join Logic (Guest vs Authenticated User)
    if (guestName) {
      isGuest = true;
      userId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      clerkId = userId;
      userName = guestName;
      userImage = `https://ui-avatars.com/api/?name=${guestName}&background=random`;
    } else if (req.auth && req.auth.userId) {
       // Authenticated User Join
       isGuest = false;
       clerkId = req.auth.userId;
       
       const User = (await import("../models/User.js")).default; 
       const user = await User.findOne({ clerkId });
       
       if (user) {
          userId = user._id;
          userName = user.name;
          userImage = user.profileImage;
          
          // Verify host/participant status
          if (session.host.toString() === userId.toString()) {
              // Re-joining as host
          } else if (session.participant && session.participant.toString() === userId.toString()) {
              // Re-joining as participant
          } else if (session.participant) {
              return res.status(409).json({ message: "Session is full" });
          } 
       } else {
          return res.status(404).json({ message: "User not found in database" });
       }
    } else {
       return res.status(400).json({ message: "Join failed: Must provide guest name or be authenticated" });
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
