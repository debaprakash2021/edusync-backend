import {
  getInstructorEarningsService,
  getCourseEarningsService,
  requestWithdrawalService,
  getAllWithdrawalsService,
  updateWithdrawalStatusService,
} from "../services/earning.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const getMyEarnings = async (req, res) => {
  try {
    const result = await getInstructorEarningsService(req.user.id);
    sendSuccess(res, 200, "Earnings fetched", result);
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

export const getCourseEarnings = async (req, res) => {
  try {
    const result = await getCourseEarningsService(req.user.id, req.params.courseId);
    sendSuccess(res, 200, "Course earnings fetched", result);
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

export const requestWithdrawal = async (req, res) => {
  try {
    const { amount, bankDetails } = req.body;
    const withdrawal = await requestWithdrawalService(req.user.id, amount, bankDetails);
    sendSuccess(res, 201, "Withdrawal request submitted", withdrawal);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};

export const getAllWithdrawals = async (req, res) => {
  try {
    const withdrawals = await getAllWithdrawalsService(req.query.status);
    sendSuccess(res, 200, "Withdrawals fetched", withdrawals);
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

export const updateWithdrawalStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const withdrawal = await updateWithdrawalStatusService(
      req.params.withdrawalId,
      status,
      adminNote
    );
    sendSuccess(res, 200, "Withdrawal status updated", withdrawal);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};