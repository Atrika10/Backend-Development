import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

const userRegister = asyncHandler(async (req, res) => {

    // get data from frontend
    const { fullName, email, userName, password } = req.body;

    // validation
    if (!fullName || !email || !userName || !password) {
        throw new ApiError(400, "All fields are required");
    }

    // check user is already there or not
    const existedUser = await User.findOne({
        $or: [
            { email },
            { userName }
        ]
    });
    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }

    // handle Images => multer middleware gives you access of req.files
    const avatarLocalPath = req.files?.avatar[0]?.path;

    const coverImgLocalPath = req.files?.CoverImg[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");

    }

    //get the localpath now upload to the cloudinary
    const avatarResponse = await uploadOnCloudinary(avatarLocalPath);

    const coverImgResponse = await uploadOnCloudinary(coverImgLocalPath);

    
    // check once more, did you get avatarResponse or not
    if(!avatarResponse) {
        throw new ApiError(400, "Avatar upload failed");

    }

    // create a user object & put it to the db
    const user =  await User.create({
        fullName,
        email,
        userName : userName.toLowerCase(),
        password,
        avatar: avatarResponse.url,
        coverImg: coverImgResponse?.url || "",

    })

    // check is the user is created or not & remove password & refreshToken?
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    // check for user creation
    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user");

    }

    // finally return res
    return res.status(201).json(
        new ApiResponse(200, "User registered successfully", createdUser)
    )

})

export { userRegister }; 