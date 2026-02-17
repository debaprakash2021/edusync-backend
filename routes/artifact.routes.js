import express from "express";
import { createArtifact, getArtifacts } from "../controllers/artifact.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

// ✅ UPDATED: Import specific limiters
import { uploadLimiter, apiLimiter } from "../middlewares/ratelimiter.middleware.js";

import {
  validate,
  createArtifactValidation,
  getArtifactsValidation
} from "../middlewares/validation.middleware.js";

const router = express.Router();

// ✅ UPDATED: Use uploadLimiter for file uploads (10 req / hour)
router.post(
  "/", 
  authMiddleware, 
  uploadLimiter,  // ✅ Changed to uploadLimiter
  upload.single("media"), 
  validate(createArtifactValidation),
  createArtifact
);

// ✅ UPDATED: Use apiLimiter for browsing (100 req / min)
router.get(
  "/",
  apiLimiter,  // ✅ Changed to apiLimiter
  authMiddleware,
  authorizeRoles("ADMIN"),
  validate(getArtifactsValidation),
  getArtifacts
);

export default router;