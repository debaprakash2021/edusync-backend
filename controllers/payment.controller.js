import {
  createOrderService,
  verifyPaymentService,
  handleWebhookService,
} from "../services/payment.service.js";
import { sendSuccess, sendError } from "../utils/response.js";
export const createOrder = async (req, res) => {
  try {
    const { couponCode } = req.body;
    const result = await createOrderService(req.user.id, req.params.courseId, couponCode);
    sendSuccess(res, 201, "Order created", result);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    const result = await verifyPaymentService(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );
    sendSuccess(res, 200, result.message, result);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};

export const razorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const result = await handleWebhookService(req.rawBody, signature);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};