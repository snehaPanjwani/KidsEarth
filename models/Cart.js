import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 }
}, { _id: false });

const CartSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    items: { type: [CartItemSchema], default: [] },
    updatedAt: { type: Date, default: Date.now }
});

CartSchema.methods.calculateTotal = async function() {
    await this.populate("items.product").execPopulate();
    return this.items.reduce((sum, it) => {
        const price = it.product?.sellPrice ?? 0;
        return sum + price * it.quantity;
    }, 0);
};

export const Cart = mongoose.model("Cart", CartSchema);