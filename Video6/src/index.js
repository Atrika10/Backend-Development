console.log("hello world");

import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import userRouter from "./routes/user.routes.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB()
    .then(()=>{
        console.log("Database connection established successfully.");

        // before starting the server, check is there any error 
        app.on('error', (err)=>{
            console.error("Error occurred in the application:", err);
        })

        app.get("/", (req, res)=>{
            res.send("Welcome to the Video Platform API");
        })
        //app.use("/api/v1/users", userRouter);
        // Start the server or perform other operations here
        app.listen(PORT, ()=>{
            console.log(`Server is running on port ${PORT}`);
        })

    })
    .catch((error)=>{
        console.error("Failed to connect to the database:", error);
    });