import express from "express";
import { getMyInvoices } from "../controllers/invoice.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { apiLimiter } from "../middlewares/ratelimiter.middleware.js";

const router = express.Router();

router.get("/my", authMiddleware, apiLimiter, getMyInvoices);

export default router;