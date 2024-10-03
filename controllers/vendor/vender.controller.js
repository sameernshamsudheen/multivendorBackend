import path from "path";
import asyncHandler from "../../utils/asyncHandler.js";
import { fileURLToPath } from "url";
import ApiError from "../../utils/apierror.js";
import { User } from "../../models/usermodal.js";
import { Vendor } from "../../models/vendormodel.js";
import sendMail from "../../utils/sendmail.js";
import { ApiResponse } from "../../utils/apiresponse.js";
import uploadToCloudinary from "../../utils/cloudinary.js";

export const vendorRegistration = asyncHandler(async (req, res, next) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  try {
    const { storeName, storeDescription, subscription } = req.body;
    if ([storeName, storeDescription].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }
    const userExists = await User.findById(req.user?._id);

    if (!userExists) {
      throw new ApiError(500, "Please signup to be user");
    }

    const alreadyVendor = await Vendor.findOne({ user: req.user?._id });
    console.log(alreadyVendor, "already vendor");

    if (alreadyVendor) {
      throw new ApiError(500, "Already a vendor");
    }

    const storeImageLocalPath = req.files?.storeImage[0]?.path;

    const storeImage = await uploadToCloudinary(storeImageLocalPath);

    const newVendor = new Vendor({
      user: req.user?._id,
      storeName,
      storeDescription,
      storeImage: storeImage?.url || "",
      subscription,
    });

    const savedVendor = await newVendor.save();

    if (!savedVendor) {
      throw new ApiError(500, " user not found");
    }

    const currentVendorRelatedUser = await User.findById(
      savedVendor.user._id.toString()
    );

    if (!currentVendorRelatedUser) {
      throw new ApiError(500, " Related user not found");
    }

    currentVendorRelatedUser.role = "vendor";
    await currentVendorRelatedUser.save();

    const data = { user: currentVendorRelatedUser.name };
    const templatepath = path.join(
      __dirname,
      "../../emailtemplate/vendorregistration.ejs"
    );

    try {
      await sendMail({
        email: currentVendorRelatedUser.email,
        subject: "vendor registration",
        template: templatepath,
        data,
      });
      return res
        .status(200)
        .json(new ApiResponse(200, "ok", "user registration successfull"));
    } catch (error) {
      throw new ApiError(400, error.message);
    }
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});
