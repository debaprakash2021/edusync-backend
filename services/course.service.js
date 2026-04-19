import Course from "../models/course.model.js";
import Section from "../models/section.model.js";
import Lecture from "../models/lecture.model.js";
import cloudinary from "../config/cloudinary.js";

export const createCourseService = async (instructorId, data) => {
  const course = await Course.create({
    ...data,
    instructor: instructorId,
  });
  return course;
};

export const getCoursesService = async (filters = {}) => {
  const query = { status: "PUBLISHED" };
  if (filters.category) query.category = filters.category;
  if (filters.isFree !== undefined) query.isFree = filters.isFree === "true";

  const courses = await Course.find(query)
    .populate("instructor", "name avatar")
    .sort({ createdAt: -1 });
  return courses;
};

export const getCourseByIdService = async (courseId) => {
  const course = await Course.findById(courseId).populate(
    "instructor",
    "name avatar bio"
  );
  if (!course) throw new Error("Course not found");

  const sections = await Section.find({ course: courseId }).sort({ order: 1 });
  const lectures = await Lecture.find({ course: courseId }).sort({ order: 1 });

  const sectionsWithLectures = sections.map((section) => ({
    ...section.toObject(),
    lectures: lectures.filter(
      (l) => l.section.toString() === section._id.toString()
    ),
  }));

  return { course, sections: sectionsWithLectures };
};

export const updateCourseService = async (courseId, instructorId, data) => {
  const course = await Course.findOne({ _id: courseId, instructor: instructorId });
  if (!course) throw new Error("Course not found or unauthorized");
  Object.assign(course, data);
  await course.save();
  return course;
};

export const createSectionService = async (courseId, instructorId, title, order) => {
  const course = await Course.findOne({ _id: courseId, instructor: instructorId });
  if (!course) throw new Error("Course not found or unauthorized");
  const section = await Section.create({ course: courseId, title, order });
  return section;
};

export const createLectureService = async (sectionId, instructorId, data, file) => {
  const section = await Section.findById(sectionId).populate("course");
  if (!section) throw new Error("Section not found");
  if (section.course.instructor.toString() !== instructorId.toString())
    throw new Error("Unauthorized");

  let videoUrl = null;
  let videoPublicId = null;

  if (file) {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "edusync/lectures",
          eager: [{ streaming_profile: "full_hd", format: "m3u8" }],
          eager_async: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(file.buffer);
    });
    videoUrl = result.secure_url;
    videoPublicId = result.public_id;
  }

  const lecture = await Lecture.create({
    ...data,
    section: sectionId,
    course: section.course._id,
    videoUrl,
    videoPublicId,
  });

  return lecture;
};