import { searchCoursesService } from "../services/search.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const searchCourses = async (req, res) => {
  try {
    const { q, category, isFree } = req.query;
    const results = await searchCoursesService(q, { category, isFree });
    sendSuccess(res, 200, "Search results", results);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};