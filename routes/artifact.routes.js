import express from "express";
import { createArtifact ,getArtifacts} from "../controllers/artifact.controller.js";
import {rateLimiter} from "../middlewares/ratelimiter.middleware.js";
import { authMiddleware} from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import {upload} from "../middlewares/upload.middleware.js";

const router = express.Router();

//protected routes for artifact management

router.post("/", authMiddleware, upload.single("media"), createArtifact);
router.get("/",rateLimiter, authMiddleware,authorizeRoles("ADMIN"), getArtifacts);

export default router;