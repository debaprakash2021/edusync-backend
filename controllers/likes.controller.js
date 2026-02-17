import { asyncHandler } from "../middlewares/errorHandler.middleware.js";
import { ApiResponse } from "../utils/response.js";
import { toggleLikeService, getLikeCountService } from "../services/likes.service.js";

export const toggleLike = asyncHandler(async (req, res) => {
  const result = await toggleLikeService({
    artifactId: req.params.id,
    userId: req.user.id
  });

  const message = result.liked ? "Artifact liked" : "Artifact unliked";
  return ApiResponse.success(res, result, message);
});

export const getLikeCount = asyncHandler(async (req, res) => {
  const count = await getLikeCountService(req.params.id);

  return ApiResponse.success(res, { likes: count }, "Like count retrieved successfully");
});