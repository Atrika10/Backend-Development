import mongoose from 'mongoose';
const addressSchema = new mongoose.Schema({
    street : {
        type : String,
        required : true,
    },
    city : {
        type :String,
        required : true,
    },
    state : {
        type : String,
        required : true,
    },
    pincode :{
        type : Number,
        required : true,
    }
})
const userSchema = new  mongoose.Schema({
    name :{
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
    },
    address : {
        type : [addressSchema],
        required : true,
        default : [{
            street : "",
            city : "",
            state : "",
            pincode : 0
        }]
    }, // Array of address objects
    phone :{
        type : String,
        required : true,
    }
}, {timestamps : true});

export const User = mongoose.model("User", userSchema);