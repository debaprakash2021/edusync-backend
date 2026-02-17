import express from "express";
import { createArtifact, getArtifacts } from "../controllers/artifact.controller.js";
import { rateLimiter } from "../middlewares/ratelimiter.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

// ✅ ADD THIS
import {
  validate,
  createArtifactValidation,
  getArtifactsValidation
} from "../middlewares/validation.middleware.js";

const router = express.Router();

router.post(
  "/", 
  authMiddleware, 
  upload.single("media"), 
  validate(createArtifactValidation),  // ✅ NEW
  createArtifact
);

router.get(
  "/",
  rateLimiter, 
  authMiddleware,
  authorizeRoles("ADMIN"),
  validate(getArtifactsValidation),  // ✅ NEW
  getArtifacts
);

export default router;