import Coupon from "../models/coupon.model.js";
import CouponUsage from "../models/couponUsage.model.js";
import Course from "../models/course.model.js";

export const createCouponService = async (adminId, data) => {
  const coupon = await Coupon.create({ ...data, createdBy: adminId });
  return coupon;
};

export const validateCouponService = async (code, studentId, courseId) => {
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon) throw new Error("Invalid coupon code");
  if (!coupon.isActive) throw new Error("Coupon is no longer active");
  if (coupon.expiresAt < new Date()) throw new Error("Coupon has expired");
  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit)
    throw new Error("Coupon usage limit reached");

  const alreadyUsed = await CouponUsage.findOne({
    coupon: coupon._id,
    student: studentId,
  });
  if (alreadyUsed) throw new Error("You have already used this coupon");

  if (coupon.applicableCourses.length > 0) {
    const isApplicable = coupon.applicableCourses
      .map((id) => id.toString())
      .includes(courseId.toString());
    if (!isApplicable) throw new Error("Coupon is not applicable for this course");
  }

  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");
  if (course.price < coupon.minOrderAmount)
    throw new Error(`Minimum order amount is INR ${coupon.minOrderAmount}`);

  let discountAmount = 0;
  if (coupon.discountType === "FLAT") {
    discountAmount = coupon.discountValue;
  } else {
    discountAmount = Math.round((course.price * coupon.discountValue) / 100);
    if (coupon.maxDiscountAmount !== null) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
    }
  }

  const finalAmount = Math.max(course.price - discountAmount, 0);

  return {
    couponId: coupon._id,
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discountAmount,
    originalPrice: course.price,
    finalAmount,
  };
};

export const recordCouponUsageService = async (couponId, studentId, orderId, discountApplied) => {
  await CouponUsage.create({ coupon: couponId, student: studentId, order: orderId, discountApplied });
  await Coupon.findByIdAndUpdate(couponId, { $inc: { usedCount: 1 } });
};

export const deactivateCouponService = async (couponId, adminId) => {
  const coupon = await Coupon.findByIdAndUpdate(
    couponId,
    { isActive: false },
    { new: true }
  );
  if (!coupon) throw new Error("Coupon not found");
  return coupon;
};

export const getAllCouponsService = async () => {
  return await Coupon.find().sort({ createdAt: -1 });
};