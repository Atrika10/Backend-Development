import mongoose from "mongoose";
const todoSchema = new mongoose.Schema({
    title :{
        type: String,
        required: true,
        minlength : [3, "Title must be at least 3 characters long"],
    },
    completed : {
        type :Boolean,
        default: false
    },
    subtodos : [{
        type :  mongoose.Schema.Types.ObjectId,
        ref : "SubTodo"
    }],
});

export const Todo = mongoose.model("Todo", todoSchema);