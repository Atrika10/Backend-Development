import { Router } from "express";
import { logOutUser, userLogin, userRegister } from "../controllers/user.controller.js";
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
userRouter.route("/logout").post(authMiddleware, logOutUser);

export default userRouter;