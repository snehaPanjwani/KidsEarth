import express from "express";
import { placeOrder, getOrderHistory } from "../controllers/ordercontroller.js";

const OrderRouter = express.Router();

OrderRouter.post("/place", placeOrder);
OrderRouter.get("/history", getOrderHistory);

export default OrderRouter;