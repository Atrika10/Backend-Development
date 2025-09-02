import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary =  async (localFilePath) => {
    try {
        if(!localFilePath) {
            throw new Error('No file path provided');
        }

        const uploadResult = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto', // Automatically detect the resource type (image, video, etc.)
        })

        console.log("file is uploaded on cloudinary", uploadResult.url);
        fs.unlinkSync(localFilePath);

        return uploadResult;
    } catch (error) {
        fs.unlinkSync(localFilePath); // we wrote this code to delete the file if it is not uploaded because if the file is not uploaded, it will be stored in the local directory and will take up space.
        throw new Error('File upload failed: ' + error.message);
        
    }
} 

export default uploadOnCloudinary;
