import {
  createQuizService,
  getQuizService,
  submitQuizService,
  getMyAttemptsService,
} from "../services/quiz.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const createQuiz = async (req, res) => {
  try {
    const quiz = await createQuizService(req.body, req.user.id);
    sendSuccess(res, 201, "Quiz created", quiz);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};

export const getQuiz = async (req, res) => {
  try {
    const quiz = await getQuizService(req.params.quizId, req.user.id);
    sendSuccess(res, 200, "Quiz fetched", quiz);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { answers, timeTakenSeconds } = req.body;
    const result = await submitQuizService(
      req.params.quizId,
      req.user.id,
      answers,
      timeTakenSeconds || 0
    );
    sendSuccess(res, 200, "Quiz submitted", result);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};

export const getMyAttempts = async (req, res) => {
  try {
    const attempts = await getMyAttemptsService(req.params.quizId, req.user.id);
    sendSuccess(res, 200, "Attempts fetched", attempts);
  } catch (err) {
    sendError(res, 500, err.message);
  }
};