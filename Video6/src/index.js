console.log("hello world");

import connectDB from "./db/index.js";

connectDB()
    .then(()=>{
        console.log("Database connection established successfully.");

    })
    .catch((error)=>{
        console.error("Failed to connect to the database:", error);
    });