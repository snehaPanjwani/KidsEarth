import express from "express";
import ApiResponse from "../utils/ApiResponse.js";
import { processPayment } from "../controllers/paymentController.js";
import { Order } from "../models/Order.js";

const PaymentRouter = express.Router();

/**
 * POST /process
 * Body: { orderId, method }
 * Processes payment for an existing order and updates order status.
 */
PaymentRouter.post("/process", async (req, res) => {
  try {
    const { orderId, method } = req.body;
    if (!orderId) return res.json(new ApiResponse(false, "orderId is required", null, null));

    const order = await Order.findById(orderId);
    if (!order) return res.json(new ApiResponse(false, "Order not found", null, null));
    if (order.status === "paid") return res.json(new ApiResponse(false, "Order already paid", null, null));

    const payResult = await processPayment({ amount: order.totalPrice, method: method || "unknown", orderId: order._id });
    if (!payResult || !payResult.success) {
      await Order.findByIdAndUpdate(orderId, { status: "cancelled" });
      return res.json(new ApiResponse(false, "Payment failed", null, null));
    }

    order.status = "paid";
    order.payment = {
      method: method || "unknown",
      transactionId: payResult.transactionId,
      paidAt: payResult.paidAt
    };
    await order.save();

    return res.json(new ApiResponse(true, "Payment processed", order, null));
  } catch (error) {
    return res.json(new ApiResponse(false, "Payment processing failed", null, error?.message || error));
  }
});

/**
 * GET /status/:orderId
 * Returns payment/status info for an order.
 */
PaymentRouter.get("/status/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.json(new ApiResponse(false, "Order not found", null, null));
    return res.json(new ApiResponse(true, "Order status", { status: order.status, payment: order.payment }, null));
  } catch (error) {
    return res.json(new ApiResponse(false, "Failed to get order status", null, error?.message || error));
  }
});

export default PaymentRouter;