import express from "express";
import {
  createNote,
  getLectureNotes,
  getCourseNotes,
  updateNote,
  deleteNote,
} from "../controllers/note.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { apiLimiter, interactionLimiter } from "../middlewares/ratelimiter.middleware.js";

const router = express.Router();

router.post("/lectures/:lectureId", authMiddleware, interactionLimiter, createNote);
router.get("/lectures/:lectureId", authMiddleware, apiLimiter, getLectureNotes);
router.get("/courses/:courseId", authMiddleware, apiLimiter, getCourseNotes);
router.patch("/:noteId", authMiddleware, updateNote);
router.delete("/:noteId", authMiddleware, deleteNote);

export default router;