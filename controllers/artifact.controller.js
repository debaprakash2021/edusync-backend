import { createArtifactService ,getArtifactsService} from "../services/artifact.service.js";



// POST /artifacts
// Controller to create a new artifact
export const createArtifact = async (req, res) => {
  try {
    const artifact = await createArtifactService({
      title: req.body.title,
      content: req.body.content,
      userId: req.user.id,
      filePath:req.file?.path           // injected by auth middleware
    });

    res.status(201).json({
      success: true,
      message: "Artifact created successfully",
      artifact
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};




// GET /artifacts
// Controller to fetch artifacts based on user role
export const getArtifacts = async (req, res) => {
  try {

    console.log(req.user); // Debugging line to check user info from auth middleware

    const artifacts = await getArtifactsService({
      userId: req.user.id,
      role: req.user.role
    });

    res.status(200).json({
      success: true,
      artifacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


