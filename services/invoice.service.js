import Invoice from "../models/invoice.model.js";
import Order from "../models/order.model.js";
import User from "../models/users.models.js";
import Course from "../models/course.model.js";
import { generateInvoicePDF } from "../utils/generateInvoice.js";
import { sendInvoiceEmail } from "./email.service.js";

const generateInvoiceNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(Math.random() * 90000) + 10000;
  return `INV-${year}${month}-${random}`;
};

export const generateAndSendInvoiceService = async (orderId) => {
  const order = await Order.findById(orderId)
    .populate("student", "name email")
    .populate("course", "title price");

  if (!order) throw new Error("Order not found");
  if (order.status !== "PAID") throw new Error("Order is not paid");

  const existing = await Invoice.findOne({ order: orderId });
  if (existing) return existing;

  const invoiceNumber = generateInvoiceNumber();

  const pdfBuffer = await generateInvoicePDF({
    invoiceNumber,
    date: order.updatedAt,
    studentName: order.student.name,
    studentEmail: order.student.email,
    courseName: order.course.title,
    amount: order.amount,
  });

  await sendInvoiceEmail(
    order.student.email,
    order.student.name,
    order.course.title,
    pdfBuffer,
    invoiceNumber
  );

  const invoice = await Invoice.create({
    order: orderId,
    student: order.student._id,
    course: order.course._id,
    invoiceNumber,
    amount: order.amount,
  });

  return invoice;
};

export const getMyInvoicesService = async (studentId) => {
  const invoices = await Invoice.find({ student: studentId })
    .populate("course", "title thumbnail")
    .sort({ createdAt: -1 });
  return invoices;
};