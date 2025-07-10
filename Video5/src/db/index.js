import mongoose from "mongoose";
import { DB_NAME } from "../constants";

const connectDB = async () => {
    try {
       const connectionInstance =  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
       console.log(`\n MongoDb connected !!! DB HOST :${connectionInstance.connection.host}`)

    } catch (error) {
        console.error("MongoDB connection Error:", error);
        process.exit(1);   // we're writing this code in a file that is executed when the server starts, so if there's an error, we want to exit the process
        
    }
}

export default connectDB;