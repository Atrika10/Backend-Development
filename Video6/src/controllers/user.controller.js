import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";


const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        // find user from userId
        const user = await User.findById(userId);
        if (!user) {
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

const userLogin = asyncHandler(async (req, res) => {
    // get data from frontend
    // validation
    // find user
    // generate access & refresh token
    // send response to the user
    console.log("reqqqqqqqq bodyyyyyyyyy", req.body);
    const { userName, email, password } = req.body;
    if (!userName || !email) {
        throw new ApiError(400, "email or userName is required");
    }

    const user = await User.findOne({
        $or: [
            { email },
            { userName }
        ]
    })

    if (!user) {
        throw new ApiError(404, "User not found");
    }
    // check password is correct or not
    const isPasswordCorrect = user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid credentials");
    }


    // generate tokens
    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

    // call db again as refreshToken is not available in user right now as we've called this function later
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    if (!loggedInUser) {
        throw new ApiError(404, "User not found");
    }

    // we need options as we'll use cookies
    const options = {
        httpOnly: true,
        secure: true
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
                    user: loggedInUser,
                    accessToken,
                    refreshToken

                }
            )
        )


})


const logOutUser = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    // user.refreshToken = "";
    // await user.save({validateBeforeSave: false});

    await User.findByIdAndUpdate(
        user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, "User logged out successfully")
        )

})

const generateAccessToken = asyncHandler(async (req, res) => {

    const inComingRefreshToken = req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!inComingRefreshToken) {
        throw new ApiError(401, "Unauthorized Request");
    }
    const decodeToken = jwt.verify(inComingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodeToken._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (inComingRefreshToken !== user.refreshToken) {
        throw new ApiError(401, "Invalid refresh token");
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

    console.log("My new Generated tokens", accessToken, refreshToken);

    // as I'll send accessToken & refreshToken in cookies I need options
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                "Access token generated successfully",
                {
                    accessToken,
                    refreshToken
                }

            )
        )

})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    // to change current password I need user, as this is secure route then I'll have req.user
    // first I'll check old password of this user is correct or not?
    // if correct then we'll update newPW
    const user = req.user;
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isOldPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isOldPasswordCorrect) {
        throw new ApiError(401, "Invalid old password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(200, "Password changed successfully")
    )

})

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return res.status(200).json(
        new ApiResponse(200, "User fetched successfully", user)
    )

})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body;
    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required");
    }

    const user = User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email
            }
        },
        { new: true }
    ).select("-password");

    console.log("Account details updated successfully", user);
    return res
        .status(200)
        .json(
            new ApiResponse(200, "User details updated successfully", user)
        )
})

const updateAvatar = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading avatar");
    }

    const updateUser = await User.findByIdAndUpdate(
        user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        }
    ).select("-password");

    return res.status(200).json(
        new ApiResponse(200, "Avatar updated successfully", updateUser)
    )
})

const updateCoverImage = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const coverImageLocalPath = req.file?.path;
    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image is required");
    }

    const coverimage = await uploadOnCloudinary(coverImageLocalPath);

    if (!coverimage.url) {
        throw new ApiError(400, "Error while uploading cover image");
    }

    const updateUser = await User.findByIdAndUpdate(
        user?._id,
        {
            $set: {
                coverImage: coverimage.url
            }
        },
        { new: true }
    ).select("-password");

    return res.status(200).json(
        new ApiResponse(200, "Cover image updated successfully", updateUser)
    )
})

const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { userName } = req.params;
    if (!userName) {
        throw new ApiError(400, "userName is required");
    }

    const channelInfo = await User.aggregate([
        {
            $match: {
                userName: userName?.toLowerCase()
            }
        }, // stage 1 : Got 1 user by userName
        {
            $lookup: {
                from: "subscriptions", // collection name from which you want to join
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        }, // stage 2 : join with subscriptions collection to get all subscribers of this channel
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedChannels"
            }
        },// stage 3 : join with subscriptions collection to get all channels to which this user has subscribed
        {
            $addFields: {
                subscriberCount: {
                    $size: "$subscribers"
                },
                subscribeChannelsCount: {
                    $size: "$subscribedChannels"
                },
                isSubscribed: {
                    $cond: {
                        if: {
                            $in: [req.user?._id, "$subscribers.subscriber"] // check whether the logged in user is present in the subscribers list of this channel
                        },
                        then: true,
                        else: false
                    }
                }
            }
        }, // stage 4 : add 2 more fields subscriberCount & subscribedChannelsCount to the user object
        {
            $project: {
                fullName: 1,
                userName: 1,
                subscriberCount: 1,
                subscribeChannelsCount: 1,
                isSubscribed: 1,
                email: 1,
                avatar: 1,
                coverImage: 1,
                createdAt: 1

            }

        }// stage 5 : project the fields which you want to send to the frontend
    ])

    console.log("channelInfo**********", channelInfo);

    if (!channelInfo?.length) {
        throw new ApiError(404, "Channel does not exist");
    }

    return res.status(200).json(
        new ApiResponse(200, "Channel info fetched successfully", channelInfo[0])
    )


})

const getWatchHistory = asyncHandler(async (req, res) => {
    // write aggregation query to get watch history of the logged in user

    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        userName: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    console.log("user watch history---------------", user);

    return res.status(200).json(
        new ApiResponse(200,
            "User watch history fetched successfully",
            user[0].watchHistory)
    )
})
export {
    userRegister,
    userLogin,
    logOutUser,
    generateAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateAvatar,
    updateCoverImage,
    getUserChannelProfile,
    getWatchHistory
}; 