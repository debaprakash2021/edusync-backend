import express from "express";
import { searchCourses } from "../controllers/search.controller.js";
import { apiLimiter } from "../middlewares/ratelimiter.middleware.js";

const router = express.Router();

router.get("/", apiLimiter, searchCourses);

export default router;