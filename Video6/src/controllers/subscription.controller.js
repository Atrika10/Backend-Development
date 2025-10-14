import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscriptions.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    const subscriberList = await User.aggregate([
        {
            $match : {
                _id : new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup : {
                from : 'subscriptions',
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        
    ])
    console.log("channel's subsriber list", subscriberList);
    let totalSubscriber = {
        totalSubscriber : subscriberList.length
    };
    return res.status(200).json(
        new ApiResponse(200, "Fetched subscription list",true, totalSubscriber)
    )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}