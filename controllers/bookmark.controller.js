import {
  toggleBookmarkService,
  getMyBookmarksService,
} from "../services/bookmark.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const toggleBookmark = async (req, res) => {
  try {
    const result = await toggleBookmarkService(req.user.id, req.params.lectureId);
    sendSuccess(res, 200, result.bookmarked ? "Bookmarked" : "Bookmark removed", result);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};

export const getMyBookmarks = async (req, res) => {
  try {
    const bookmarks = await getMyBookmarksService(req.user.id, req.query.courseId);
    sendSuccess(res, 200, "Bookmarks fetched", bookmarks);
  } catch (err) {
    sendError(res, 500, err.message);
  }
};