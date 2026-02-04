import express from "express";
import path from "path";
import cors from "cors";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";

import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoute.js";

import http from "http";
import { Server } from "socket.io";
import inviteRoutes from "./routes/inviteRoute.js";

const app = express();
const server = http.createServer(app);

const __dirname = path.resolve();

// Middleware
app.use(express.json());
// Allow credentialed requests (cookies/headers) for CORS
const allowedOrigins = [
  ENV.CLIENT_URL, 
  "https://frontendtalentiq.netlify.app",
  "https://talent-iq-backend-h0rb.onrender.com"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

if (ENV.CLERK_PUBLISHABLE_KEY && ENV.CLERK_SECRET_KEY) {
  console.log("✅ Clerk authentication initialized");
}

app.use(clerkMiddleware({ publishableKey: ENV.CLERK_PUBLISHABLE_KEY, secretKey: ENV.CLERK_SECRET_KEY })); // this adds auth field to request object: req.auth()

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/invite", inviteRoutes);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join_session", (sessionId) => {
    socket.join(sessionId);
    console.log(`User ${socket.id} joined session ${sessionId}`);
  });

  socket.on("code_change", ({ sessionId, code }) => {
    socket.to(sessionId).emit("code_update", code);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

app.get("/health", (req, res) => {
  res.status(200).json({ msg: "api is up and running" });
});

// make our app ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

const startServer = async () => {
  try {
    await connectDB();
    server.listen(ENV.PORT, () => console.log("Server is running on port:", ENV.PORT));
  } catch (error) {
    console.error("💥 Error starting the server", error);
  }
};

startServer();
