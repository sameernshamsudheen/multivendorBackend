import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import ApiError from "./apierror.js";

const uploadToCloudinary = async (localFilePath) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_SECRET_KEY,
    });

    if (!localFilePath) {
      throw new ApiError(500, "no local path found");
    }

    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log(uploadResult, "===upload result===");
    fs.unlinkSync(localFilePath);
    return uploadResult
  } catch (error) {
    fs.unlinkSync(localFilePath);
    throw new ApiError(500, "Something went wrong while uploading  image");
  }
};

export default uploadToCloudinary;
