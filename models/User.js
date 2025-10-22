import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    address : {
        street: { type: String},
        city: { type: String},
        state: { type: String},
        zipCode: { type: String}
    },
    mobile : { type: String},
});

export const User = mongoose.model("User", userSchema);