import {
  addCommentService,
  getCommentsService
} from "../services/comment.service.js";

// Controller to add a comment to an artifact
export const addComment = async (req, res) => {
  try {
    const comment = await addCommentService({
      artifactId: req.params.id,
      userId: req.user.id,
      text: req.body.text
    });

    res.status(201).json({
      success: true,
      comment: comment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Controller to get all comments for an artifact
// ✅ FIXED: Now passes artifactId (req.params.id) to service
export const getComments = async (req, res) => {
  try {
    const comments = await getCommentsService(req.params.id); // ✅ THE FIX IS HERE

    res.status(200).json({
      success: true,
      comments: comments
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch comments"
    });
  }
};