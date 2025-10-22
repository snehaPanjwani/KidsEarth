import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
   id: { type: String, required: true, unique: true },
   name: { type: String, required: true },
   markedPrice: { type: Number, required: true },
   sellPrice: { type: Number, required: true },
   discount: { type: Number, required: true },
   description: { type: String, required: true },
   category: { type: String, required: true },
   stock: { type: Number, required: true },
   quantity : { type:Number, required:true},
   image: { type: String, required: true },
   status : { type: Boolean, required: true}
});

export const Product = mongoose.model("Product", ProductSchema);