import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import ApiResponse from "../utils/ApiResponse.js";

export async function addToCart(req, res) {
    try {
        const { userId, productId, quantity } = req.body;
        if (!userId || !productId || !quantity) {
            return res.json(new ApiResponse(false, "Missing required fields", null, null));
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.json(new ApiResponse(false, "Product not found", null, null));
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = await Cart.create({ userId, items: [] });
        }

        const existingItem = cart.items.find(item => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        return res.json(new ApiResponse(true, "Added to cart", cart, null));
    } catch (error) {
        return res.json(new ApiResponse(false, "Failed to add to cart", null, error?.message || error));
    }
}

export async function getCart(req, res) {
    try {
        const { userId } = req.params;
        const cart = await Cart.findOne({ userId }).populate('items.product');
        if (!cart) {
            return res.json(new ApiResponse(true, "Cart is empty", { userId, items: [] }, null));
        }
        return res.json(new ApiResponse(true, "Cart retrieved", cart, null));
    } catch (error) {
        return res.json(new ApiResponse(false, "Failed to get cart", null, error?.message || error));
    }
}

export async function updateCartItem(req, res) {
    try {
        const { userId, productId, quantity } = req.body;
        if (!userId || !productId || !quantity) {
            return res.json(new ApiResponse(false, "Missing required fields", null, null));
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.json(new ApiResponse(false, "Cart not found", null, null));
        }

        const item = cart.items.find(item => item.product.toString() === productId);
        if (!item) {
            return res.json(new ApiResponse(false, "Item not in cart", null, null));
        }

        item.quantity = quantity;
        await cart.save();
        return res.json(new ApiResponse(true, "Cart updated", cart, null));
    } catch (error) {
        return res.json(new ApiResponse(false, "Failed to update cart", null, error?.message || error));
    }
}

export async function removeCartItem(req, res) {
    try {
        const { userId, productId } = req.body;
        if (!userId || !productId) {
            return res.json(new ApiResponse(false, "Missing required fields", null, null));
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.json(new ApiResponse(false, "Cart not found", null, null));
        }

        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();
        return res.json(new ApiResponse(true, "Item removed from cart", cart, null));
    } catch (error) {
        return res.json(new ApiResponse(false, "Failed to remove item", null, error?.message || error));
    }
}