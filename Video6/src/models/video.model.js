import mongoose, {Schema} from "mongoose";

const videoSchema = new Schema(
    {
        videoUrl : {
            type: String, // cloudinary url
            required: true
        },
         thumbnail : {
            type: String, // cloudinary url
            required: true
        },
        title : {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        description : {
            type: String,
            required: true,
            trim: true
        },
        duration : {
            type: Number, // in seconds
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished : {
            type: Boolean,
            default: false
        },
        owner : {
            type : Schema.Types.ObjectId,
            ref : 'User',
            required: true
        },
    },
    {timestamps: true}
)
export const Video = mongoose.model('Video', videoSchema);