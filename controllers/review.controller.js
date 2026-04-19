import {
  addReviewService,
  updateReviewService,
  deleteReviewService,
  getCourseReviewsService,
} from "../services/review.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await addReviewService(req.user.id, req.params.courseId, rating, comment);
    sendSuccess(res, 201, "Review added", review);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};

export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await updateReviewService(req.params.reviewId, req.user.id, rating, comment);
    sendSuccess(res, 200, "Review updated", review);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};

export const deleteReview = async (req, res) => {
  try {
    const result = await deleteReviewService(req.params.reviewId, req.user.id);
    sendSuccess(res, 200, result.message);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};

export const getCourseReviews = async (req, res) => {
  try {
    const reviews = await getCourseReviewsService(req.params.courseId);
    sendSuccess(res, 200, "Reviews fetched", reviews);
  } catch (err) {
    sendError(res, 500, err.message);
  }
};