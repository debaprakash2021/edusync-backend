import {
  createNoteService,
  getNotesForLectureService,
  getNotesForCourseService,
  updateNoteService,
  deleteNoteService,
} from "../services/note.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const createNote = async (req, res) => {
  try {
    const { content, timestampSeconds } = req.body;
    const note = await createNoteService(req.user.id, req.params.lectureId, content, timestampSeconds);
    sendSuccess(res, 201, "Note created", note);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};

export const getLectureNotes = async (req, res) => {
  try {
    const notes = await getNotesForLectureService(req.user.id, req.params.lectureId);
    sendSuccess(res, 200, "Notes fetched", notes);
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

export const getCourseNotes = async (req, res) => {
  try {
    const notes = await getNotesForCourseService(req.user.id, req.params.courseId);
    sendSuccess(res, 200, "Notes fetched", notes);
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

export const updateNote = async (req, res) => {
  try {
    const note = await updateNoteService(req.params.noteId, req.user.id, req.body.content);
    sendSuccess(res, 200, "Note updated", note);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};

export const deleteNote = async (req, res) => {
  try {
    const result = await deleteNoteService(req.params.noteId, req.user.id);
    sendSuccess(res, 200, result.message);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};