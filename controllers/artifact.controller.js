import { asyncHandler } from "../middlewares/errorHandler.middleware.js";
import { ApiResponse } from "../utils/response.js";
import { createArtifactService, getArtifactsService } from "../services/artifact.service.js";

// ✅ UPDATED: Remove try-catch, use asyncHandler
export const createArtifact = asyncHandler(async (req, res) => {
  const artifact = await createArtifactService({
    title: req.body.title,
    content: req.body.content,
    userId: req.user.id,
    filePath: req.file?.path
  });

  return ApiResponse.created(res, { artifact }, "Artifact created successfully");
});

export const getArtifacts = asyncHandler(async (req, res) => {
  const artifacts = await getArtifactsService({
    userId: req.user.id,
    role: req.user.role
  });

  return ApiResponse.success(res, { artifacts }, "Artifacts retrieved successfully");
});