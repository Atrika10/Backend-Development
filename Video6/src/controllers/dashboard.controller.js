import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscriptions.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const userId = req.user?._id;
    //total Videos
    const allVideos = await Video.find({
        owner: userId
    })

    // total video views
    let sum = 0;
    for (let index = 0; index < allVideos.length; index++) {
        const element = allVideos[index];
        sum += element.views
    }
    console.log(sum);

    //total Like
    const totalLike = await Like.find({
        likedBy : userId
    })

    const fetchedDetails = {
        totalVideo : allVideos.length,
        totalVideoViews : sum,
        totalLike : totalLike.length
    }

    return res.status(200).json(
        new ApiResponse(200, "Dashboard details fetched successfully", true, fetchedDetails)
    )


})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const userId = req.user?._id;
    const allVideos = await Video.find({
        owner: userId
    })
    let sum = 0;
    for (let index = 0; index < allVideos.length; index++) {
        const element = allVideos[index];
        sum += element.views
    }
    console.log(sum);

    return res.status(200).json(
        new ApiResponse(200, "All videos have been Fetched", true, allVideos)
    )
})

export {
    getChannelStats,
    getChannelVideos
}