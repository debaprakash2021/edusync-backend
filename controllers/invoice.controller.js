import { getMyInvoicesService } from "../services/invoice.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const getMyInvoices = async (req, res) => {
  try {
    const invoices = await getMyInvoicesService(req.user.id);
    sendSuccess(res, 200, "Invoices fetched", invoices);
  } catch (err) {
    sendError(res, 500, err.message);
  }
};