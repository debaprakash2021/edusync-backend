import { hasActiveSubscriptionService } from "../services/subscription.service.js";
import Enrollment from "../models/enrollment.model.js";
import Course from "../models/course.model.js";

export const checkCourseAccess = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const courseId = req.params.courseId || req.params.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (course.isFree || course.price === 0) return next();

    const isEnrolled = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });
    if (isEnrolled) return next();

    const hasSubscription = await hasActiveSubscriptionService(studentId);
    if (hasSubscription) return next();

    return res.status(403).json({
      success: false,
      message: "Purchase this course or subscribe to access",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};