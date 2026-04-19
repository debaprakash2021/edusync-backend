import Course from "../models/course.model.js";

export const searchCoursesService = async (query, filters = {}) => {
  if (!query || query.trim() === "") throw new Error("Search query is required");

  const searchQuery = {
    status: "PUBLISHED",
    $text: { $search: query },
  };

  if (filters.category) searchQuery.category = filters.category;
  if (filters.isFree !== undefined) searchQuery.isFree = filters.isFree === "true";

  const courses = await Course.find(searchQuery, { score: { $meta: "textScore" } })
    .populate("instructor", "name avatar")
    .sort({ score: { $meta: "textScore" } })
    .limit(20);

  return courses;
};