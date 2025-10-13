import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const userId = req.user._id;
    const { content } = req.body;
    if (!content) throw new ApiError(400, "Content is required");

    const tweet = await Tweet.create({
        owner: userId,
        content
    })

    console.log("Tweet has been creted", tweet);
    return res.status(200).json(
        new ApiResponse(200, "Tweet has been creted", tweet)
    )
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const userId =  req.user._id;

    const tweets = await Tweet.find({
        owner : userId
    })
    console.log("All tweets : ", tweets);

    return res.status(200).json(
        new ApiResponse(200, "Fetched all tweets", tweets)
    )
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params;
    const { content } = req.body;

    if (!content) throw new ApiError(400, "Content is required");

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            content: content
        },
        { new: true }
    )

    return res.status(200).json(
        new ApiResponse(200, "Tweet has been updated successfully", updatedTweet)
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId } = req.params;
    await Tweet.findByIdAndDelete(tweetId);

    return res.status(200).json(
        new ApiResponse(200, "Tweet has been deleted successfully")
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
