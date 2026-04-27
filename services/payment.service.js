import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import Order from "../models/order.model.js";
import Course from "../models/course.model.js";
import Enrollment from "../models/enrollment.model.js";
import { validateCouponService, recordCouponUsageService } from "./coupon.service.js";
import { generateAndSendInvoiceService } from "./invoice.service.js";
import { recordEarningService } from "./earning.service.js";

export const createOrderService = async (studentId, courseId, couponCode = null) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");
  if (course.status !== "PUBLISHED") throw new Error("Course is not available");

  const alreadyEnrolled = await Enrollment.findOne({
    student: studentId,
    course: courseId,
  });
  if (alreadyEnrolled) throw new Error("Already enrolled in this course");

  if (course.isFree || course.price === 0)
    throw new Error("This course is free, enroll directly");

  let finalAmount = course.price;
  let couponData = null;

  if (couponCode) {
    couponData = await validateCouponService(couponCode, studentId, courseId);
    finalAmount = couponData.finalAmount;
  }

  const amountInPaise = finalAmount * 100;

  const razorpayOrder = await razorpay.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: `receipt_${studentId}_${courseId}_${Date.now()}`,
    notes: {
      courseId: courseId.toString(),
      studentId: studentId.toString(),
      couponCode: couponCode || "",
    },
  });

  const order = await Order.create({
    student: studentId,
    course: courseId,
    razorpayOrderId: razorpayOrder.id,
    amount: finalAmount,
    originalAmount: course.price,
    discountAmount: course.price - finalAmount,
    coupon: couponData?.couponId || null,
    currency: "INR",
  });

  if (couponData) {
    await recordCouponUsageService(
      couponData.couponId,
      studentId,
      order._id,
      couponData.discountAmount
    );
  }

  return {
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    courseName: course.title,
    originalPrice: course.price,
    discountAmount: course.price - finalAmount,
    finalAmount,
    keyId: process.env.RAZORPAY_KEY_ID,
  };
};

export const verifyPaymentService = async (
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature
) => {
  const body = razorpayOrderId + "|" + razorpayPaymentId;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    throw new Error("Invalid payment signature");
  }

  const order = await Order.findOne({ razorpayOrderId });
  if (!order) throw new Error("Order not found");
  if (order.status === "PAID") throw new Error("Order already processed");

  order.status = "PAID";
  order.razorpayPaymentId = razorpayPaymentId;
  await order.save();

  const alreadyEnrolled = await Enrollment.findOne({
    student: order.student,
    course: order.course,
  });

  if (!alreadyEnrolled) {
    await Enrollment.create({
      student: order.student,
      course: order.course,
    });
    await Course.findByIdAndUpdate(order.course, {
      $inc: { enrollmentCount: 1 },
    });
  }
  recordEarningService(order._id).catch((err) =>
  console.error("Earning record failed:", err.message)
);

  return {
    message: "Payment verified and enrollment successful",
    courseId: order.course,
  };
};

export const handleWebhookService = async (rawBody, signature) => {
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  if (expectedSignature !== signature) {
    throw new Error("Invalid webhook signature");
  }

  const event = JSON.parse(rawBody);

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    const razorpayOrderId = payment.order_id;

    const order = await Order.findOne({ razorpayOrderId });
    if (!order || order.status === "PAID") return { received: true };

    order.status = "PAID";
    order.razorpayPaymentId = payment.id;
    await order.save();
    generateAndSendInvoiceService(order._id).catch((err) =>
    console.error("Invoice generation failed:", err.message)
    );

    const alreadyEnrolled = await Enrollment.findOne({
      student: order.student,
      course: order.course,
    });

    if (!alreadyEnrolled) {
      await Enrollment.create({
        student: order.student,
        course: order.course,
      });
      await Course.findByIdAndUpdate(order.course, {
        $inc: { enrollmentCount: 1 },
      });
    }
  }

  if (event.event === "payment.failed") {
    const payment = event.payload.payment.entity;
    await Order.findOneAndUpdate(
      { razorpayOrderId: payment.order_id },
      { status: "FAILED" }
    );
  }
  recordEarningService(order._id).catch((err) =>
  console.error("Earning record failed:", err.message)
);

  return { received: true };
};