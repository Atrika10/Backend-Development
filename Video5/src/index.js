import connectDB from "./db/index.js";
connectDB()
    .then(() => {
        console.log("Connected to MongoDB successfully");
    }
    )
    .catch((error) => {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1); 
    });