import express from "express";
import { getStreamToken, chatWithAI } from "../controllers/chatController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/token", protectRoute, getStreamToken);
router.post("/", protectRoute, chatWithAI);

export default router;
