import mongoose from "mongoose";
import express from "express";
import path from "path";
import cors from "cors";
import router from "./routers/WebRouter.js";
import admin from "./routers/AdminRouter.js";
import fileUpload from "express-fileupload";
import authRouter from "./routers/AuthRouter.js";

let conn = await mongoose.connect("mongodb://localhost:27017/kidsearthdb");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use("/images", express.static(path.join(process.cwd(), "images")));
app.use("/admin", admin);
app.use("/api", router);
app.use("/auth", authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})