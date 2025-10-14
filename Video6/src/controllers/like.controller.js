import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on video
    const {videoId} = req.params
    const userId = req.user._id;

    const likedOnVideo = await Like.create({
        video : videoId,
        likedBy : userId
    })
    console.log("like on video", likedOnVideo);

    return res.status(200).json(
        new ApiResponse(200, "Liked on Video", likedOnVideo)
    )
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on comment
    const {commentId} = req.params
    const userId = req.user._id;
    const likedOnComment = await Like.create({
        comment : commentId,
        likedBy : userId
    })
    console.log("like on comment", likedOnComment);

    return res.status(200).json(
        new ApiResponse(200, "Liked on comment", likedOnComment)
    )

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on tweet
    const {tweetId} = req.params
    const userId = req.user._id;

    const likedOnTweet = await Like.create({
        tweet : tweetId,
        likedBy : userId
    })
    console.log("like on tweet", likedOnTweet);

    return res.status(200).json(
        new ApiResponse(200, "Liked on tweet", likedOnTweet)
    )
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}