import { Router } from "express";
import { userRegister } from "../controllers/user.controller.js";
const userRouter = Router();
import { upload } from "../middlewares/multer.middleware.js"; 
 
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

// userRouter.post("/register",upload.fields([
//         {name: 'avatar',
//          maxCount: 1
//         },
//         {
//             name: 'coverImage',
//             maxCount: 1
//         }
//     ]), userRegister );

export default userRouter;