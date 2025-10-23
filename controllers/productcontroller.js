import { Product } from "../models/Product.js";
import ApiResponse from "../utils/ApiResponse.js";

export async function listProducts(req, res) {
    try {
        const products = await Product.find({ status: true });
        return res.json(new ApiResponse(true, "Products retrieved", products, null));
    } catch (error) {
        return res.json(new ApiResponse(false, "Failed to get products", null, error?.message || error));
    }
}

export async function getProductById(req, res) {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.json(new ApiResponse(false, "Product not found", null, null));
        }
        return res.json(new ApiResponse(true, "Product retrieved", product, null));
    } catch (error) {
        return res.json(new ApiResponse(false, "Failed to get product", null, error?.message || error));
    }
}