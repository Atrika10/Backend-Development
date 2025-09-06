import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/apiResponse.js";


const authMiddleware = async (req, res, next) =>{
try {
    const token = req.cookies?.accessToken 
    || req.header("Authorization")?.replace("Bearer ", "");

    if(!token){
        throw new ApiError(401, "Unauthorized Request");
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("DECODE TOKEN", decodeToken);
    
    const user = await User.findById(decodeToken._id);

    if(!user){
        throw new ApiError(404, "User not found");
    }

    req.user = user;
    next();
} catch (error) {
    console.log("error in auth middleware");
    return res.status(500)
    .json(
        new ApiResponse(
            401,
            error.message
        )
    )
}
}

export  {authMiddleware}