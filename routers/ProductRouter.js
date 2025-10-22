import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";
import ApiResponse from "../utils/ApiResponse.js";
import { processPayment } from "./paymentController.js";

export async function placeOrder(req, res) {
    try {
        const userId = req.body.userId || req.user?.id;
        if (!userId) return res.json(new ApiResponse(false, "User ID required", null, null));

        // get cart
        const cart = await Cart.findOne({ userId }).populate("items.product");
        if (!cart || cart.items.length === 0) {
            return res.json(new ApiResponse(false, "Cart is empty", null, null));
        }

        // validate stock and prepare order items
        const orderItems = [];
        for (const it of cart.items) {
            const prod = it.product;
            if (!prod) return res.json(new ApiResponse(false, "Product not found in catalog", null, null));
            if (prod.stock < it.quantity) {
                return res.json(new ApiResponse(false, `Insufficient stock for ${prod.name}`, null, null));
            }
            orderItems.push({
                productId: prod._id,
                name: prod.name,
                sellPrice: prod.sellPrice,
                quantity: it.quantity
            });
        }

        // calculate total
        const totalPrice = orderItems.reduce((s, i) => s + i.sellPrice * i.quantity, 0);

        // create order (status pending)
        const order = await Order.create({
            userId,
            items: orderItems,
            totalPrice,
            status: "pending"
        });

        // decrement stock
        const bulkOps = orderItems.map(i => ({
            updateOne: {
                filter: { _id: i.productId, stock: { $gte: i.quantity } },
                update: { $inc: { stock: -i.quantity } }
            }
        }));
        const bulkResult = await Product.bulkWrite(bulkOps);
        // Note: bulkResult doesn't guarantee check of all matched; in production check matchedCount vs modifiedCount.

        // process payment (simulated)
        const paymentMethod = req.body.paymentMethod || "card_simulated";
        const payResult = await processPayment({ amount: totalPrice, method: paymentMethod, orderId: order._id });

        if (!payResult.success) {
            // rollback stock if needed (simple rollback)
            await Promise.all(orderItems.map(i => Product.updateOne({ _id: i.productId }, { $inc: { stock: i.quantity } })));
            await Order.findByIdAndUpdate(order._id, { status: "cancelled" });
            return res.json(new ApiResponse(false, "Payment failed", null, null));
        }

        // update order as paid
        order.status = "paid";
        order.payment = {
            method: paymentMethod,
            transactionId: payResult.transactionId,
            paidAt: payResult.paidAt
        };
        await order.save();

        // clear cart
        cart.items = [];
        cart.updatedAt = Date.now();
        await cart.save();

        return res.json(new ApiResponse(true, "Order placed and paid", order, null));
    } catch (error) {
        return res.json(new ApiResponse(false, "Place order failed", null, error?.message || error));
    }
}

export async function getOrderHistory(req, res) {
    try {
        const userId = req.query.userId || req.user?.id;
        if (!userId) return res.json(new ApiResponse(false, "User ID required", null, null));

        const orders = await Order.find({ userId }).sort({ createdAt: -1 });
        return res.json(new ApiResponse(true, "Order history", orders, null));
    } catch (error) {
        return res.json(new ApiResponse(false, "Failed to fetch order history", null, error?.message || error));
    }
}