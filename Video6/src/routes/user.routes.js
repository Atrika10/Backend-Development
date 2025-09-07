import { Router } from "express";
import { logOutUser, userLogin, userRegister, generateAccessToken } from "../controllers/user.controller.js";
const userRouter = Router();
import { upload } from "../middlewares/multer.middleware.js"; 
import { authMiddleware } from "../middlewares/auth.middleware.js";
 
userRouter.route("/register").post(
    upload.fields([
        {name: 'avatar',
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
userRouter.route("/refresh-token").post(generateAccessToken)


export default userRouter;