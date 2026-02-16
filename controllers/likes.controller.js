import {
  toggleLikeService,
  getLikeCountService
} from "../services/likes.service.js";

// Controller to toggle like/unlike for an artifact
export const toggleLike = async (req, res) => {
  try {
    const result = await toggleLikeService({
      artifactId: req.params.id,
      userId: req.user.id
    });

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Controller to get total like count for an artifact
// ✅ FIXED: Now passes artifactId (req.params.id) to service
export const getLikeCount = async (req, res) => {
  try {
    const count = await getLikeCountService(req.params.id); // ✅ THE FIX IS HERE

    res.status(200).json({
      success: true,
      likes: count
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch like count"
    });
  }
};