import razorpay from "../config/razorpay.js";
import Plan from "../models/plan.model.js";
import Subscription from "../models/subscription.model.js";
import crypto from "crypto";

export const createPlanService = async (data) => {
  const plan = await Plan.create(data);
  return plan;
};

export const getActivePlansService = async () => {
  return await Plan.find({ isActive: true }).sort({ price: 1 });
};

export const createSubscriptionOrderService = async (studentId, planId) => {
  const plan = await Plan.findById(planId);
  if (!plan) throw new Error("Plan not found");
  if (!plan.isActive) throw new Error("Plan is no longer available");

  const activeSubscription = await Subscription.findOne({
    student: studentId,
    status: "ACTIVE",
    endDate: { $gt: new Date() },
  });
  if (activeSubscription) throw new Error("You already have an active subscription");

  const amountInPaise = plan.price * 100;

  const razorpayOrder = await razorpay.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: `sub_${studentId}_${planId}_${Date.now()}`,
    notes: {
      planId: planId.toString(),
      studentId: studentId.toString(),
      type: "subscription",
    },
  });

  const subscription = await Subscription.create({
    student: studentId,
    plan: planId,
    razorpayOrderId: razorpayOrder.id,
    amount: plan.price,
  });

  return {
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    planName: plan.name,
    duration: plan.duration,
    keyId: process.env.RAZORPAY_KEY_ID,
  };
};

export const verifySubscriptionPaymentService = async (
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

  const subscription = await Subscription.findOne({ razorpayOrderId }).populate("plan");
  if (!subscription) throw new Error("Subscription not found");
  if (subscription.status === "ACTIVE") throw new Error("Subscription already activated");

  const startDate = new Date();
  const endDate = new Date();

  if (subscription.plan.duration === "MONTHLY") {
    endDate.setMonth(endDate.getMonth() + 1);
  } else {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }

  subscription.status = "ACTIVE";
  subscription.razorpayPaymentId = razorpayPaymentId;
  subscription.startDate = startDate;
  subscription.endDate = endDate;
  await subscription.save();

  return {
    message: "Subscription activated successfully",
    startDate,
    endDate,
    plan: subscription.plan.name,
  };
};

export const getMySubscriptionService = async (studentId) => {
  const subscription = await Subscription.findOne({
    student: studentId,
    status: "ACTIVE",
    endDate: { $gt: new Date() },
  }).populate("plan", "name duration features");

  return subscription || null;
};

export const hasActiveSubscriptionService = async (studentId) => {
  const subscription = await Subscription.findOne({
    student: studentId,
    status: "ACTIVE",
    endDate: { $gt: new Date() },
  });
  return !!subscription;
};