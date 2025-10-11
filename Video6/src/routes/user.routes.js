import { Router } from "express";
import { logOutUser, userLogin, userRegister, generateAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateAvatar, updateCoverImage, getUserChannelProfile } from "../controllers/user.controller.js";
const userRouter = Router();
import { upload } from "../middlewares/multer.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

userRouter.route("/register").post(
    upload.fields([
        {
            name: 'avatar',
            maxCount: 1
        },
        {
            name: 'coverImage',
            maxCount: 1
        }
    ]),
    userRegister);

userRouter.route("/login").post(userLogin);

// secure route
userRouter.route("/logout").post(authMiddleware, logOutUser);
userRouter.route("/refresh-token").post(generateAccessToken);
userRouter.route("/change-password").post(authMiddleware, changeCurrentPassword);
userRouter.route("/current-user").get(authMiddleware, getCurrentUser);

userRouter.route("/update-account-details").patch(authMiddleware, updateAccountDetails);
userRouter.route("/update-avatar").patch(authMiddleware, upload.single("avatar"), updateAvatar);
userRouter.route("/update-cover-image").patch(authMiddleware, upload.single('coverImage'), updateCoverImage);

userRouter.route("/channel/:userName").get(authMiddleware, getUserChannelProfile);
userRouter.route("/watch-history/:userName").get(authMiddleware, getUserChannelProfile);

export default userRouter;