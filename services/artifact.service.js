import Artifact from "../models/artifact.models.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
// creating a new artifact
export const createArtifactService = async ({
  title,
  content,
  userId,
  filePath
}) => {
  if (!title || !content) {
    throw new Error("Title and content are required");
  }

  let mediaUrl = null;
  if (filePath) {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: "artifacts"
    });
    mediaUrl = uploadResult.secure_url;
    fs.unlinkSync(filePath);              // Clean up the local file after upload
  }
  console.log("Media URL:", mediaUrl);

  const artifact = await Artifact.create({
    title,
    content,
    author: userId,
    media: mediaUrl || null
  });

  return artifact;
};



// fetching artifacts based on user role
export const getArtifactsService = async ({ userId, role }) => {
  if (role === "ADMIN") {
    return await Artifact.find().populate("author", "name email role"); // Admins can see all artifacts with author details
  }


  return await Artifact.find({ author: userId }); // Regular users can only see their own artifacts
};