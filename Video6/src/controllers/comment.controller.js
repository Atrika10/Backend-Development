import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

    const allComments = await Comment.find({
        video : videoId
    });
    console.log("fetched All comments", allComments);

    return res.status(200).json(
        new ApiResponse (200, "fetched All comments", allComments)
    )

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { comment } = req.body;
    const userId = req.user?._id;
    const { videoId } = req.params;

    const newComment = await Comment.create({
        content: comment,
        video: videoId,
        owner: userId
    });

    console.log("New comment added", newComment);
    return res.status(200).json(
        new ApiResponse(200, "New comment added", newComment)
    )
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params;
    const { comment } = req.body;
    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { content: comment },
        { new: true }
    )
    console.log("Comment Updated Successfully", updatedComment)
    return res.status(200).json(
        new ApiResponse(200, "Comment Updated Successfully", updatedComment)
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params;
    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json(
        new ApiResponse(200, "Comment Deleted Successfully.")
    )
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}
