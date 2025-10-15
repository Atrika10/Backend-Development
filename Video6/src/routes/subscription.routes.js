import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js"
import {authMiddleware} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(authMiddleware); // Apply authMiddleware to all routes in this file

router
    .route("/c/:channelId")
    .get(getUserChannelSubscribers)   // GET subscribers of channelId
    .post(toggleSubscription);        // toggle subscription for channelId (current user)

router.route("/u/:subscriberId").get(getSubscribedChannels);   //GET channels that subscriberId has subscribed to

export default router