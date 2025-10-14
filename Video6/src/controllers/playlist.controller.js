import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    const userId = req.user._id;
    //TODO: create playlist
    if (!name || !description) throw new ApiError(400, "name and description are required.")

    const newPlaylist = await Playlist.create({
        name,
        description,
        owner: userId
    })

    return res.status(200).json(
        new ApiResponse(200, "New Playlist has been created", true, newPlaylist)
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params
    //TODO: get user playlists
    const allPlayList = await Playlist.find({
        owner: userId
    });

    console.log("Fetched all playlist", allPlayList);

    return res.status(200).json(
        new ApiResponse(200, "Fetched all playlist", true, allPlayList)
    )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    //TODO: get playlist by id
    const playListDeatils = await Playlist.findById(playlistId);

    console.log("Fetched playlist details", playListDeatils);

    return res.status(200).json(
        new ApiResponse(200, "Fetched playlist details", true, playListDeatils)
    )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $addToSet: {
                videos: videoId
            }
            // $push: {
            //     videos: videoId
            // }
        },
        {
            new: true
        }
    )

    console.log("Video has been added to the playlist", updatedPlaylist);

    return res.status(200).json(
        new ApiResponse(200, "Video has been added to the playlist", true, updatedPlaylist)
    )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    // TODO: remove video from playlist

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull : {
                videos : new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            new : true
        }
    )

    return res.status(200).json(
        new ApiResponse(200, "Video removed successfully", true, updatedPlaylist)
    )


})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    // TODO: delete playlist

    const deletedPlayListDetails = await Playlist.findByIdAndDelete(playlistId);

    console.log("Playlist deleted Successfully", deletedPlayListDetails);
    return res.status(200).json(
        new ApiResponse(200, "Playlist deleted Successfully", deletedPlayListDetails)
    )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body
    //TODO: update playlist
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            name,
            description
        },
        {
            new: true
        }
    )

    console.log("Playlist has been updated Successfully", updatedPlaylist);
    return res.status(200).json(
        new ApiResponse(200, "Playlist has been updated Successfully", updatedPlaylist)
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
