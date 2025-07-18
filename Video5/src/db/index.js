import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    console.log(DB_NAME);
    console.log(process.env.MONGODB_URI);
    try {
       const connectionInstance =  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
       console.log(`\n MongoDb connected !!! DB HOST :${connectionInstance.connection.host}`)

    } catch (error) {
        console.error("MongoDB connection Error:", error);
        process.exit(1);  
    }
}

export default connectDB;