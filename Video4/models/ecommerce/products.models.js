import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    name : {},
    description : {},
    price : {
        type: Number,
        required: true
    },
    category : {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required: true
    }
}, {timestamps : true});
export const Product = mongoose.model("Product", productSchema);
