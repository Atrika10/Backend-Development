import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { json } from "express";

const generateAccessTokenAndRefreshToken = async (userId)=>{
    try {
        // find user from userId
        const user = await User.findById(userId);
        if(!user){
            throw new ApiError(404, "User not found");
        } 
        
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // we'll store refreshToken in mongoDB so that later we can compare
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });


        return {
            accessToken,
            refreshToken
        }


    } catch (error) {
        throw new ApiError(500, "Something went wrong While generating access & refresh token");
    } 
}

const userRegister = asyncHandler(async (req, res) => {

    // get data from frontend
    const { fullName, email, userName, password } = req.body;

    // validation
    if (!fullName || !email || !userName || !password) {
        throw new ApiError(400, "All fields are required");
    }

    // check user is already there or not
    const existedUser = await User.findOne({
        $or: [
            { email },
            { userName }
        ]
    });
    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }

    // handle Images => multer middleware gives you access of req.files
    const avatarLocalPath = req.files?.avatar?.[0]?.path;

    const coverImgLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");

    }

    //get the localpath now upload to the cloudinary
    let avatarResponse = "";
    let coverImgResponse = "";


    if (avatarLocalPath) {
        avatarResponse = await uploadOnCloudinary(avatarLocalPath);
    }
    if (coverImgLocalPath) {
        coverImgResponse = await uploadOnCloudinary(coverImgLocalPath);
    }


    // check once more, did you get avatarResponse or not
    if (!avatarResponse) {
        throw new ApiError(400, "Avatar upload failed");

    }

    // create a user object & put it to the db
    const user = await User.create({
        fullName,
        email,
        userName: userName.toLowerCase(),
        password,
        avatar: avatarResponse.url,
        coverImage: coverImgResponse?.url || "",

    })

    // check is the user is created or not & remove password & refreshToken?
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    // check for user creation
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");

    }

    // finally return res
    return res.status(201).json(
        new ApiResponse(200, "User registered successfully", createdUser)
    )

})

const userLogin = asyncHandler(async (req, res)=>{
    // get data from frontend
    // validation
    // find user
    // generate access & refresh token
    // send response to the user
    console.log("reqqqqqqqq bodyyyyyyyyy", req.body);
    const {userName, email, password } = req.body;
    if(!userName || !email){
        throw new ApiError(400, "email or userName is required");
    }

    const user = await User.findOne({
        $or:[
            {email},
            {userName}
        ]
    })

    if(!user){
        throw new ApiError(404, "User not found");
    }
    // check password is correct or not
    const isPasswordCorrect = user.isPasswordCorrect(password);
    if(!isPasswordCorrect){
        throw new ApiError(401, "Invalid credentials");
    }


    // generate tokens
    const {accessToken, refreshToken} =  await generateAccessTokenAndRefreshToken(user._id);

    // call db again as refreshToken is not available in user right now as we've called this function later
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    if(!loggedInUser){
        throw new ApiError(404, "User not found");
    }

    // we need options as we'll use cookies
    const options = {
        httpOnly: true,
        secure : true
    }
    // send response to the user through cookies
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            "User logged in successfully",
            {
             user : loggedInUser,
             accessToken,
             refreshToken
            
            }
        )
    )
    

})


const logOutUser = asyncHandler(async (req, res)=>{
    const user = req.user;
    if(!user){
        throw new ApiError(404, "User not found");
    }
    // user.refreshToken = "";
    // await user.save({validateBeforeSave: false});

    await User.findByIdAndUpdate(user._id, {
        $unset: {
            refreshToken: 1
        }
    })
    const options = {
        httpOnly: true,
        secure : true
    }
    
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, "User logged out successfully")
    )

})
export {
    userRegister,
    userLogin,
    logOutUser
}; 