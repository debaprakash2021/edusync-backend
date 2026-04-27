import Earning from "../models/earning.model.js";
import Withdrawal from "../models/withdrawal.model.js";
import Order from "../models/order.model.js";
import Course from "../models/course.model.js";

const PLATFORM_FEE_PERCENT = 30;

export const recordEarningService = async (orderId) => {
  const order = await Order.findById(orderId).populate("course");
  if (!order) throw new Error("Order not found");
  if (order.status !== "PAID") throw new Error("Order is not paid");

  const existing = await Earning.findOne({ order: orderId });
  if (existing) return existing;

  const course = await Course.findById(order.course).populate("instructor");
  if (!course) throw new Error("Course not found");

  const saleAmount = order.amount;
  const platformEarning = Math.round((saleAmount * PLATFORM_FEE_PERCENT) / 100);
  const instructorEarning = saleAmount - platformEarning;

  const earning = await Earning.create({
    instructor: course.instructor._id,
    course: course._id,
    order: orderId,
    student: order.student,
    saleAmount,
    platformFeePercent: PLATFORM_FEE_PERCENT,
    instructorEarning,
    platformEarning,
  });

  return earning;
};

export const getInstructorEarningsService = async (instructorId) => {
  const earnings = await Earning.find({ instructor: instructorId })
    .populate("course", "title thumbnail")
    .populate("student", "name email")
    .sort({ createdAt: -1 });

  const totalEarned = earnings.reduce((sum, e) => sum + e.instructorEarning, 0);
  const pendingEarnings = earnings
    .filter((e) => e.status === "PENDING")
    .reduce((sum, e) => sum + e.instructorEarning, 0);

  const approvedWithdrawals = await Withdrawal.find({
    instructor: instructorId,
    status: { $in: ["APPROVED", "PAID"] },
  });

  const totalWithdrawn = approvedWithdrawals.reduce((sum, w) => sum + w.amount, 0);
  const availableBalance = pendingEarnings - totalWithdrawn;

  return {
    totalEarned,
    pendingEarnings,
    totalWithdrawn,
    availableBalance: Math.max(availableBalance, 0),
    earnings,
  };
};

export const getCourseEarningsService = async (instructorId, courseId) => {
  const earnings = await Earning.find({
    instructor: instructorId,
    course: courseId,
  })
    .populate("student", "name email")
    .sort({ createdAt: -1 });

  const total = earnings.reduce((sum, e) => sum + e.instructorEarning, 0);

  return { total, count: earnings.length, earnings };
};

export const requestWithdrawalService = async (instructorId, amount, bankDetails) => {
  const { availableBalance } = await getInstructorEarningsService(instructorId);

  if (amount > availableBalance) {
    throw new Error(`Insufficient balance. Available: INR ${availableBalance}`);
  }

  const pendingRequest = await Withdrawal.findOne({
    instructor: instructorId,
    status: "PENDING",
  });
  if (pendingRequest) throw new Error("You already have a pending withdrawal request");

  const withdrawal = await Withdrawal.create({
    instructor: instructorId,
    amount,
    bankDetails,
  });

  return withdrawal;
};

export const getAllWithdrawalsService = async (status) => {
  const query = status ? { status } : {};
  return await Withdrawal.find(query)
    .populate("instructor", "name email")
    .sort({ createdAt: -1 });
};

export const updateWithdrawalStatusService = async (withdrawalId, status, adminNote) => {
  const withdrawal = await Withdrawal.findById(withdrawalId);
  if (!withdrawal) throw new Error("Withdrawal request not found");

  withdrawal.status = status;
  withdrawal.adminNote = adminNote || "";
  withdrawal.processedAt = new Date();
  await withdrawal.save();

  if (status === "PAID") {
    await Earning.updateMany(
      { instructor: withdrawal.instructor, status: "PENDING" },
      { status: "PAID" }
    );
  }

  return withdrawal;
};