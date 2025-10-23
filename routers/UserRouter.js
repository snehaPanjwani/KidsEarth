import express from "express";
import ApiResponse from "../utils/ApiResponse.js";
import {
  listProducts,
  getProductById
} from "../controllers/productcontroller.js";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem
} from "../controllers/cartcontroller.js";
import { placeOrder, getOrderHistory } from "../controllers/ordercontroller.js";

const UserRouter = express.Router();

// Public product endpoints
UserRouter.get("/products", async (req, res) => {
  try {
    return await listProducts(req, res);
  } catch (err) {
    return res.json(new ApiResponse(false, "Failed to list products", null, err?.message || err));
  }
});

UserRouter.get("/products/:id", async (req, res) => {
  try {
    return await getProductById(req, res);
  } catch (err) {
    return res.json(new ApiResponse(false, "Failed to get product", null, err?.message || err));
  }
});

// Cart endpoints
UserRouter.post("/cart/add", async (req, res) => {
  try {
    return await addToCart(req, res);
  } catch (err) {
    return res.json(new ApiResponse(false, "Failed to add to cart", null, err?.message || err));
  }
});

UserRouter.get("/cart/:userId", async (req, res) => {
  try {
    return await getCart(req, res);
  } catch (err) {
    return res.json(new ApiResponse(false, "Failed to get cart", null, err?.message || err));
  }
});

UserRouter.put("/cart/update", async (req, res) => {
  try {
    return await updateCartItem(req, res);
  } catch (err) {
    return res.json(new ApiResponse(false, "Failed to update cart item", null, err?.message || err));
  }
});

UserRouter.delete("/cart/remove", async (req, res) => {
  try {
    return await removeCartItem(req, res);
  } catch (err) {
    return res.json(new ApiResponse(false, "Failed to remove cart item", null, err?.message || err));
  }
});

// Order endpoints (user-facing; these can be proxied to OrderRouter if preferred)
UserRouter.post("/order/place", async (req, res) => {
  try {
    return await placeOrder(req, res);
  } catch (err) {
    return res.json(new ApiResponse(false, "Failed to place order", null, err?.message || err));
  }
});

UserRouter.get("/order/history", async (req, res) => {
  try {
    return await getOrderHistory(req, res);
  } catch (err) {
    return res.json(new ApiResponse(false, "Failed to get order history", null, err?.message || err));
  }
});

export default UserRouter;