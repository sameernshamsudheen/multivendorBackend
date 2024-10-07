import path from "path";
import asyncHandler from "../../utils/asyncHandler.js";
import { fileURLToPath } from "url";
import ApiError from "../../utils/apierror.js";

import { ApiResponse } from "../../utils/apiresponse.js";
import uploadToCloudinary from "../../utils/cloudinary.js";
import destroyImage from "../../utils/cloudinaryDestroy.js";
import { Brand } from "../../models/brandmodel.js";

export const createABrand = asyncHandler(async (req, res, next) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      throw new ApiError(500, "User not found");
    }
    const logo = req?.files?.logo[0]?.path;
    if (!logo) {
      throw new ApiError(500, "Image upload issue");
    }

    const { name, description } = req.body;
    try {
      const fileStoredpublic_id = await uploadToCloudinary(logo);
      const cleanedBody = JSON.parse(JSON.stringify(req.body));
      const newBrand = await Brand.create({
        ...cleanedBody,
        logo: fileStoredpublic_id.public_id,
      });
      return res
        .status(200)
        .json(new ApiResponse(200, newBrand, "created a Brand"));
    } catch (error) {
      throw new ApiError(500, error.message);
    }
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});
export const getAllBrand = asyncHandler(async (req, res, next) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      throw new ApiError(500, "User not found");
    }

    const AllBrand = await Brand.find();
    return res
      .status(200)
      .json(new ApiResponse(200, AllBrand, "fetched all Brand"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export const updateBrand = asyncHandler(async (req, res, next) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      throw new ApiError(500, "User not found");
    }

    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      throw new ApiError(500, "Brand not found");
    }
    const publicId = brand.logo;
    console.log(publicId, "===");

    const uploadBrandImage = req.files?.logo[0]?.path;
    if (!uploadBrandImage) {
      throw new ApiError(500, "image upload issue");
    }

    const storeImageDestroy = await destroyImage(publicId);
    console.log(storeImageDestroy, "===storeImageDestroy====");

    if (storeImageDestroy.result === "not found") {
      throw new ApiError(500, "Something went wrong");
    }
    const newStoreImage = await uploadToCloudinary(uploadBrandImage);

    if (!newStoreImage) {
      throw new ApiError(500, "Image upload has some issues");
    }
    const updatedBrand = await Brand.findByIdAndUpdate(
      brand._id,
      {
        $set: {
          ...req.body,
          logo: newStoreImage.public_id,
        },
      },
      { new: true, runValidators: true }
    );
    return res
      .status(200)
      .json(new ApiResponse(200, updatedBrand, " Brand updated successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export const deleteBrand = asyncHandler(async (req, res, next) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      throw new ApiError(500, "User not found");
    }

    const brand = await Brand.findOne({ _id: req.params.id });

    if (!brand) {
      throw new ApiError(500, "Product not found");
    }
    const imagedeleted = await destroyImage(brand.logo);

    const deletedProduct = await brand.findByIdAndDelete(req.params.id);

    return res
      .status(200)
      .json(
        new ApiResponse(200, deletedProduct, "Product deleted successfully")
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});
export const getBrandBySlug = asyncHandler(async (req, res, next) => {
  const currentUser = req.user;

  if (!currentUser) {
    throw new ApiError(500, "Invalid  user");
  }

  const brandBySlug = await Brand.findOne({
    brandSlug: req.params.slug,
  });
  if (!brandBySlug) {
    throw new ApiError(500, "Brand not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, brandBySlug, "Fetched Brand by slug"));
});
