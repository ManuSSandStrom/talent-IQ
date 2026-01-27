import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  createSession,
  endSession,
  getActiveSessions,
  getMyRecentSessions,
  getSessionById,
  joinSession,
  admitGuest,
  deleteSession,
} from "../controllers/sessionController.js";

const router = express.Router();

router.post("/", protectRoute, createSession);
router.get("/active", getActiveSessions);
router.get("/my-recent", protectRoute, getMyRecentSessions);

router.get("/:id", getSessionById);
router.post("/:id/join", joinSession);
router.post("/:id/admit", protectRoute, admitGuest);
router.delete("/:id", protectRoute, deleteSession);
router.post("/:id/end", protectRoute, endSession);

export default router;
