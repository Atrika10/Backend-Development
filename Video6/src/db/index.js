import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_NAME } from "../constants.js";
dotenv.config();
const connectDB = async ()=>{
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`Database connected successfully.`);
    }catch(error){
        console.error("Error connecting to the database:", error);
        process.exit(1); // Exit the process with failure
    }
}

export default connectDB;