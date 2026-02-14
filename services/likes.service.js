import Like from "../models/likes.models.js";



// Service to toggle like/unlike for an artifact
export const toggleLikeService = async ({ artifactId, userId }) => {
  const existingLike = await Like.findOne({
    artifact: artifactId,
    user: userId
  });

  if (existingLike) {
    await Like.deleteOne({ _id: existingLike._id });
    return { liked: false };
  }

  await Like.create({
    artifact: artifactId,
    user: userId
  });

  return { liked: true };
};




// Service to get total like count for an artifact
export const getLikeCountService = async (artifactId) => {
  const count = await Like.countDocuments({ artifact: artifactId });
  return count;
};