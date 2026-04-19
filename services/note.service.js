import StudentNote from "../models/studentNote.model.js";
import Enrollment from "../models/enrollment.model.js";
import Lecture from "../models/lecture.model.js";

export const createNoteService = async (studentId, lectureId, content, timestampSeconds) => {
  const lecture = await Lecture.findById(lectureId);
  if (!lecture) throw new Error("Lecture not found");

  const enrollment = await Enrollment.findOne({ student: studentId, course: lecture.course });
  if (!enrollment) throw new Error("Not enrolled in this course");

  const note = await StudentNote.create({
    student: studentId,
    lecture: lectureId,
    course: lecture.course,
    content,
    timestampSeconds: timestampSeconds || 0,
  });

  return note;
};

export const getNotesForLectureService = async (studentId, lectureId) => {
  const notes = await StudentNote.find({ student: studentId, lecture: lectureId })
    .sort({ timestampSeconds: 1 });
  return notes;
};

export const getNotesForCourseService = async (studentId, courseId) => {
  const notes = await StudentNote.find({ student: studentId, course: courseId })
    .populate("lecture", "title order")
    .sort({ createdAt: -1 });
  return notes;
};

export const updateNoteService = async (noteId, studentId, content) => {
  const note = await StudentNote.findOne({ _id: noteId, student: studentId });
  if (!note) throw new Error("Note not found or unauthorized");
  note.content = content;
  await note.save();
  return note;
};

export const deleteNoteService = async (noteId, studentId) => {
  const note = await StudentNote.findOneAndDelete({ _id: noteId, student: studentId });
  if (!note) throw new Error("Note not found or unauthorized");
  return { message: "Note deleted" };
};