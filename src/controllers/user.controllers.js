import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import { trusted } from "mongoose";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken() // becouse this are method
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false})

        return(accessToken, refreshToken)

    } catch (error) {
        throw new apiError(500, "Something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user alredy exists: username, email
    // check for images, check for avatar
    // apload them to cloudinary, avatar
    // create user object -create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return response

    const {fullName, email, username, password} = req.body
    console.log("email", email);

    // if(fullName === ""){
    //     throw new apiError(400, "fullname is required")
    // }

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ){
        throw new apiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new apiError(409, "User with email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    // now chech agar avatarlocalpath ke  nhi hai to error throw kar do

    if (!avatarLocalPath){
        throw new apiError(400, "Avatar file is required ")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar){
        throw new apiError(400, "Avatar file is required ")
    }

    const user = await User.create({
        fullName, 
        avatar: avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-passward -refreshToken"
    )

    if (!createdUser) {
        throw new apiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new apiResponse(200, createdUser, "User registered Successfully")
    )

})

const loginUser = asyncHandler(async(req, res) => {
    // req body -> data
    // username or email
    // find the user
    // password check 
    // access and refresh token
    // send cookie

    const {email, password, username} = req.body

    if(!(username || email)){
        throw new apiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user){
       throw new apiError(404, "User does not found")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
       throw new apiError(401, "Invalid user credentials") 
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new apiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in Successfully"
        )
    )
})

const logoutUser = asyncHandler(async(req, res) => {
   const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "User logged out"))
})

const refreshAccessToken = asyncHandler(async(req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new apiError(401, "Unauthorized request")
    }

try {
    const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    ) 
    
    const user = await User.findById(decodedToken?._id)
    
    if(!user){
        throw new apiError(401, "Invalid refresh token")
    } 
    
    if(incomingRefreshToken !== user?.refreshToken){
        throw new apiError(401, "Refresh token is expired  or used")
    }
    
    const options = {
        httpOnly: true,
        secure: true
    }
    
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
    
    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new apiResponse(
            200,
            {accessToken, refreshToken: newRefreshToken},
            "Access token refreshed"
        )
    )
} catch (error) {
    throw new apiError(401, error?.message || "Invalid refresh token")
}

})

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body



    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect){
        throw new apiError(400, "")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new apiResponse(200, {}, "Password change seccessfully"))
})

const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(200, req.user, "Current user fetched successfully")
})

const updateAccountDetails = asyncHandler(async(req, res) => {
    const{fullName, email} = req.body

    if (!fullName || !email) {
        throw new apiError(400, "All fields are required")
    }

    const user = User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email // this is also write like this
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(new apiResponse(200, useSyncExternalStore, "Accont details update successfully"))
})

const updateUserAvatar = asyncHandler(async (req, res) => {
   const avatarLocalPath =  req.file?.path

   if (!avatarLocalPath) {
      throw new apiError(400, "Avatar file is missing")
   }

   const avatar = await uploadOnCloudinary(avatarLocalPath)

   if (!avatar.url) {
    throw new apiError(400, "Error while uploading on avatar")
   }

   const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
        $set: {
            avatar: avatar.url
        }
    },
    {new: set}
   ).select("-password")

   return res 
   .ststus(200)
   .json(
    new apiResponse(200, user, "Avatar image updated successfully")
   )

})

const updateUserCoverImage = asyncHandler(async (req, res) => {
   const coverImageLocalPath =  req.file?.path

   if (!coverImageLocalPath) {
      throw new apiError(400, "Cover image is missing")
   }

   const coverImage = await uploadOnCloudinary(coverImageLocalPath)

   if (!coverImage.url) {
    throw new apiError(400, "Error while uploading on cover image")
   }

   const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
        $set: {
            coverImage: coverImage.url
        }
    },
    {new: set}
   ).select("-password")

   return res 
   .ststus(200)
   .json(
    new apiResponse(200, user, "Cover image updated successfully")
   )
})

const getUserChannelProfile = asyncHandler(async(req, res) => {
    const {username} = req.params

    if (!username?.trim()) {
        throw new apiError(400, "Username is missing")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $loolup: {
               from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo" 
            }
        },
        {
            $addFields:{
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }   
        }
    ])

    if (!channel?.length) {
        throw new apiError(404, "Channel does not exists")
    }

    return res
    .status(200)
    .json(new apiResponse (200, channel[0], "User fetched Successfully"))
}) 


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar, 
    updateUserCoverImage,
    getUserChannelProfile  
}