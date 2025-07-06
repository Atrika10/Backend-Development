import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
    username: {
        type : String,
        required: true,
        unique: true,
    },
    email :{
        type :String,
        required: true,
        unique: true,
    },
    password : {
        type : String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters long'],
    }
},{
    timestamps: true,
}
); 

export const User = mongoose.model("User", userSchema);