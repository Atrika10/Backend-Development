import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import uploadOnCloudinary from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    const user = req.user;
    //console.log("req.file", req.files);
    // console.log("req.files", req.files?.videoFile);
    // console.log("req.files", req.files?.thumbnail);
    // TODO: get video, upload to cloudinary, create video
    const videoFile = req.files?.videoFile?.[0]
    const thumbnail = req.files?.thumbnail?.[0];

    if (!videoFile || !thumbnail) {
        return new ApiError(400, "video and thumbnail are required")
    }

    const videoUrl = await uploadOnCloudinary(videoFile.path);
    const thumbnailUrl = await uploadOnCloudinary(thumbnail.path);
    //console.log("cloudinary url", thumbnailUrl);

    const uploadedVideo = await Video.create({
        videoUrl: videoUrl.secure_url,
        thumbnail: thumbnailUrl.secure_url,
        title,
        description,
        duration: videoUrl.duration,
        owner: user._id
    })

    return res.status(201).json(
        new ApiResponse(
            201,
            "video published successfully",
             uploadedVideo
        )
    )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
