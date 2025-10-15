import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscriptions.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    // TODO: toggle subscription
    const subscriberId = req.user?._id;

    if (!isValidObjectId(channelId)) throw new ApiError(400, "Invalid ChannelId")

    if(channelId.toString() == subscriberId.toString()) throw new ApiError(400, "You can't subscribe yourself")

    const isSubscribed = await Subscription.findOne({
        subscriber: subscriberId,
        channel: channelId
    })

    if (isSubscribed) { // already subscribed then delete the docs
        await Subscription.deleteOne({
            _id: isSubscribed._id
        })

        return res.status(200).json(
            new ApiResponse(200, "successfully unsubscribed")
        )

    } else {
        const subscriptionDoc = await Subscription.create({
            subscriber: subscriberId,
            channel : channelId
        })

        return res.status(200).json(
            new ApiResponse(200, "successfully subscribed", true, subscriptionDoc)
        )
    }


})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    if (!isValidObjectId(channelId)) throw new ApiError(400, "Invalid ChannelId");

    const subscriberList = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: 'subscriptions',
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },

    ])
    console.log("channel's subsriber list", subscriberList);
    let totalSubscriber = {
        totalSubscriber: subscriberList.length
    };
    return res.status(200).json(
        new ApiResponse(200, "Fetched subscription list", true, totalSubscriber)
    )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    const channelList = await Subscription.find({
        subscriber: subscriberId
    })
    console.log("All channel list of given subscriber", channelList);

    return res.status(200).json(
        new ApiResponse(200, "Fectched All channel list", true, channelList)
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}