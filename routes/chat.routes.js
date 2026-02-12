import express from "express";
import { getChartByThread, sendChat } from "../controllers/chat.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router= express.Router();

router.get("/:threadId",authMiddleware,getChartByThread);
router.post("/",authMiddleware,sendChat);

export default router;