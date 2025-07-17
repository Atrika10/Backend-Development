import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    userName : {
        type : String,
        required: true,
        unique: true,
        lowercase : true,
        trim: true,
        index : true
    },
    email : {
        type : String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index : true
    },
    fullName : {
        type : String,
        required: true,
        trim: true,
        index : true
    },
    avatar : {
        type : String, // cloudanary url
        required: true,
    },
    coverImage : {
        type : String, // cloudanary url
        required: true,
    },
    watchHistory : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Video'
        }
    ],
    password : {
        type : String,
        required: [true, 'Password is required'],
    },
    refreshToken : {
        type : String
    }
}, {timestamps : true});

// password encrypt logic
userSchema.pre("save", async function(next){
    // if password is not changing then don't run this function
    if(!this.isModified("password")) return next();

    // when user give new pw or modify password run this hook (hash this password)
    this.password = bcrypt.hash(this.password, 10);
    next();
})

// we can write our own custom methods 
userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
}

export const User = mongoose.model('User', userSchema);