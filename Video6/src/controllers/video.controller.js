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

    const video = await Video.findById(videoId);
    console.log("video details : ", video);

    return res.status(200).json(
        new ApiResponse(200, "Successfully fetched Video Details", video)
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description } = req.body

    // if no title and description is provided throw error
    if (!title && !description) {
        throw new ApiError(400, "Title and description are required");
    }
    //TODO: update video details like title, description, thumbnail
    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            title: title,
            description: description
        },
        {
            new: true
        }
    )
    console.log("Updated video details", video);

    return res.status(200).json(
        new ApiResponse(200, "Video Deatils Updated Successfully", video)
    )

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    await Video.findByIdAndDelete(videoId);
    return res.status(200).json(
        new ApiResponse(200, "Video Deleted Successfully")
    )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "Video Not found");

    video.isPublished = !video.isPublished;
    await video.save();
    
    console.log("togglePublishStatus ----", video);
    return res.status(200).json(
        new ApiResponse(200, "video publish status Updated successfully", video)
    )

})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
