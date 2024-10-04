import cloudinary from "cloudinary";

const destroyImage = async (publicId) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_SECRET_KEY,
    });
    const result = await cloudinary.v2.uploader.destroy(publicId, {
      invalidate: true, // Optional: Invalidate the CDN cache for the asset
    });

    return result;
  } catch (error) {
    throw new ApiError(500, "Something went wrong while destroying image");
  }
};

export default destroyImage;