import {
  createCouponService,
  validateCouponService,
  deactivateCouponService,
  getAllCouponsService,
} from "../services/coupon.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const createCoupon = async (req, res) => {
  try {
    const coupon = await createCouponService(req.user.id, req.body);
    sendSuccess(res, 201, "Coupon created", coupon);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code, courseId } = req.body;
    const result = await validateCouponService(code, req.user.id, courseId);
    sendSuccess(res, 200, "Coupon applied", result);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};

export const deactivateCoupon = async (req, res) => {
  try {
    const coupon = await deactivateCouponService(req.params.couponId, req.user.id);
    sendSuccess(res, 200, "Coupon deactivated", coupon);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};

export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await getAllCouponsService();
    sendSuccess(res, 200, "Coupons fetched", coupons);
  } catch (err) {
    sendError(res, 500, err.message);
  }
};