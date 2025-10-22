import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    sellPrice: { type: Number, required: true },
    quantity: { type: Number, required: true }
}, { _id: false });

const PaymentSchema = new mongoose.Schema({
    method: { type: String },
    transactionId: { type: String },
    paidAt: { type: Date }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    items: { type: [OrderItemSchema], required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["pending", "paid", "cancelled"], default: "pending" },
    payment: { type: PaymentSchema, default: null },
    createdAt: { type: Date, default: Date.now }
});

export const Order = mongoose.model("Order", OrderSchema);