import { asyncHandler } from "../middlewares/errorHandler.middleware.js";
import { ApiResponse } from "../utils/response.js";
import { addCommentService, getCommentsService } from "../services/comment.service.js";

export const addComment = asyncHandler(async (req, res) => {
  // ✅ artifactId (param) and text (body) already validated!
  const comment = await addCommentService({
    artifactId: req.params.id,
    userId: req.user.id,
    text: req.body.text
  });

  return ApiResponse.created(res, { comment }, "Comment added successfully");
});

export const getComments = asyncHandler(async (req, res) => {
  // ✅ artifactId already validated!
  const comments = await getCommentsService(req.params.id);

  return ApiResponse.success(res, { comments }, "Comments retrieved successfully");
});