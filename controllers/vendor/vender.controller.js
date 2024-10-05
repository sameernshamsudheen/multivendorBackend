import path from "path";
import asyncHandler from "../../utils/asyncHandler.js";
import { fileURLToPath } from "url";
import ApiError from "../../utils/apierror.js";
import { User } from "../../models/usermodal.js";
import { Vendor } from "../../models/vendormodel.js";
import sendMail from "../../utils/sendmail.js";
import { ApiResponse } from "../../utils/apiresponse.js";
import uploadToCloudinary from "../../utils/cloudinary.js";
import destroyImage from "../../utils/cloudinaryDestroy.js";
import getPublicIdFromUrl from "../../helper/getPublicIdFromUrl.js";
import redis from "../../redis/redis.js";

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

    if (alreadyVendor) {
      throw new ApiError(500, "Already a vendor");
    }

    const storeImageLocalPath = req.files?.storeImage[0]?.path;
    console.log(storeImageLocalPath, "====storeage image====");

    const storeImage = await uploadToCloudinary(storeImageLocalPath);
    if (!storeImage) throw ApiError(500, "Image upload has some issues");

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
    const userRoleChangeRedis = await redis.get(
      currentVendorRelatedUser._id.toString()
    );
    userRoleChangeRedis.role = "vendor";
    await redis.set(
      currentVendorRelatedUser._id.toString(),
      JSON.stringify(userRoleChangeRedis)
    );
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

//@desc get all vendors
//@router /api/vendor-all
//@access admin
export const getAllVendors = asyncHandler(async (req, res, next) => {
  try {
    const currentUser = req.user;

    if (!currentUser) {
      throw new ApiError(500, "Invalid  user");
    }

    const AllVendors = await Vendor.find();
    if (AllVendors.length === 0) {
      throw new ApiError(500, "No users found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, AllVendors, "All Vendors fetched"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

//@desc update vendor
//@router /api/v1/vendor
//@access valid vendors

export const updateVendors = asyncHandler(async (req, res, next) => {
  try {
    const {
      storeName,
      storeDescription,

      subscription,
    } = req.body;
    const currentUser = req.user;

    if (!currentUser) {
      throw new ApiError(500, "Invalid  user");
    }
    const vendor = await Vendor.findOne({ user: currentUser._id });

    if (!vendor) {
      throw new ApiError(500, "vendor not found");
    }
    const storeImageLocalPath = req?.files && req.files?.storeImage[0]?.path;

    if (!storeImageLocalPath) {
      throw ApiError(500, " Image has an error cannot update ");
    }

    try {
      const publicId = getPublicIdFromUrl(vendor?.storeImage);

      const storeImageDestroy = await destroyImage(publicId);

      if (storeImageDestroy.result === "not found") {
        throw new ApiError(500, "Something went wrong");
      }
      const newStoreImage = await uploadToCloudinary(storeImageLocalPath);

      if (!newStoreImage) {
        throw new ApiError(500, "Image upload has some issues");
      }
      const updatedVendor = await Vendor.findOneAndUpdate(
        { user: currentUser._id },
        {
          $set: {
            ...req.body,
            storeImage: newStoreImage.url,
          },
        },
        { new: true, runValidators: true }
      );

      return res
        .status(200)
        .json(
          new ApiResponse(200, updatedVendor, " vendor updated successfully")
        );
    } catch (error) {
      console.log(error.message);
    }
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});
//@desc get vendor by slug
//@router /api/v1/vendor-slug/:slug
//@access  public

export const getVendorBySlug = asyncHandler(async (req, res, next) => {
  const currentUser = req.user;

  if (!currentUser) {
    throw new ApiError(500, "Invalid  user");
  }

  const vendorBySlug = await Vendor.findOne({
    storeSlug: req.params.slug,
  });
  if (!vendorBySlug) {
    throw new ApiError(500, "Vendor not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, vendorBySlug, "Fetched vendor by slug"));
});

export const deleteVendor = asyncHandler(async (req, res, next) => {
  try {
    const currentUser = req.user;

    console.log(currentUser, "===current user===");

    if (!currentUser) {
      throw new ApiError(500, "Invalid  user");
    }

    const vendor = await Vendor.findOne({ user: currentUser._id });
    console.log(vendor, "=====currentVendor");

    if (!vendor) {
      throw new ApiError(500, "Vendor not found");
    }

    const vendorDeleted = await Vendor.findByIdAndDelete(vendor._id);

    if (!vendorDeleted) {
      throw new ApiError(500, "Vendor deletion error");
    }

    const currentVendorRelatedUser = await User.findById(
      vendorDeleted.user._id
    );
    if (!currentVendorRelatedUser) {
      throw new ApiError(500, " Related user not found");
    }
    const userRoleChangeRedis = await redis.get(
      currentVendorRelatedUser._id.toString()
    );
    console.log(userRoleChangeRedis, "===delete api");

    userRoleChangeRedis.role = "user";
    await redis.set(
      currentVendorRelatedUser._id.toString(),
      JSON.stringify(userRoleChangeRedis)
    );
    currentVendorRelatedUser.role = "user";
    await currentVendorRelatedUser.save();
    return res
      .status(200)
      .json(
        new ApiResponse(200, vendorDeleted, " Vendor deleted successfully")
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});
