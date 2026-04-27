import {
  createPlanService,
  getActivePlansService,
  createSubscriptionOrderService,
  verifySubscriptionPaymentService,
  getMySubscriptionService,
} from "../services/subscription.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const createPlan = async (req, res) => {
  try {
    const plan = await createPlanService(req.body);
    sendSuccess(res, 201, "Plan created", plan);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};

export const getPlans = async (req, res) => {
  try {
    const plans = await getActivePlansService();
    sendSuccess(res, 200, "Plans fetched", plans);
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

export const createSubscriptionOrder = async (req, res) => {
  try {
    const result = await createSubscriptionOrderService(req.user.id, req.params.planId);
    sendSuccess(res, 201, "Subscription order created", result);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};

export const verifySubscriptionPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    const result = await verifySubscriptionPaymentService(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );
    sendSuccess(res, 200, result.message, result);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};

export const getMySubscription = async (req, res) => {
  try {
    const subscription = await getMySubscriptionService(req.user.id);
    sendSuccess(res, 200, "Subscription fetched", subscription);
  } catch (err) {
    sendError(res, 500, err.message);
  }
};