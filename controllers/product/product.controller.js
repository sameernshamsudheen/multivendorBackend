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
import { Product } from "../../models/productmodel.js";

export const createProduct = asyncHandler(async (req, res, next) => {
  try {
    const currentUser = req.user;

    if (!currentUser) {
      throw new ApiError(500, "Invalid  user");
    }
    const imageFiles = req.files.image;

    const ImageUrlarray = [];
    for (let file of imageFiles) {
      try {
        const fileStoredpublic_id = await uploadToCloudinary(file.path);
        ImageUrlarray.push(fileStoredpublic_id.public_id);
      } catch (error) {
        throw new ApiError(500, error.message);
      }
    }
    const cleanedBody = JSON.parse(JSON.stringify(req.body));

    const parsedVariations = cleanedBody.variations.map((variation) => ({
      color: variation.color,
      size: variation.size,
      quantity: Number(variation.quantity), // Convert to number
      price: Number(variation.price), // Convert to number
    }));
    const newProduct = await Product.create({
      ...cleanedBody,
      vendor: currentUser._id,
      variations: parsedVariations, // Assign parsed variations
      image: ImageUrlarray, // Assuming ImageUrlarray is populated with URLs of images
    });
    return res
      .status(200)
      .json(new ApiResponse(200, newProduct, "created a product"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export const getAllProduct = asyncHandler(async (req, res, next) => {
  try {
    const currentUser = req.user;

    if (!currentUser) {
      throw new ApiError(500, "Invalid  user");
    }
    const AllProduct = await Product.find().populate("re");
    return res
      .status(200)
      .json(new ApiResponse(200, AllProduct, "created a product"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export const getProductBySlug = asyncHandler(async (req, res, next) => {
  try {
    const currentUser = req.user;

    if (!currentUser) {
      throw new ApiError(500, "Invalid  user");
    }
    const productBySlug = await Product.findOne({
      productSlug: req.params.slug,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, productBySlug, "Fetched productBySlug"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
  try {
    const currentUser = req.user;

    if (!currentUser) {
      throw new ApiError(500, "Invalid  user");
    }
    const product = await Product.findOne({ _id: req.params.id });
    if (!product) {
      throw new ApiError(500, "Product not found");
    }
    try {
      product.image.map(async (id) => {
        const imagedeleted = await destroyImage(id);
      });
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);

      return res
        .status(200)
        .json(
          new ApiResponse(200, deletedProduct, "Product deleted successfully")
        );
    } catch (error) {
      throw new ApiError(500, error.message);
    }
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export const updateProduct = asyncHandler(async (req, res, next) => {
  try {
    const currentUser = req.user;

    if (!currentUser) {
      throw new ApiError(500, "Invalid  user");
    }
    const product = await Product.findOne({ _id: req.params.id });
    if (!product) {
      throw new ApiError(500, "Product not found");
    }
    try {
      const imageFiles = req.files.image;

      const ImageUrlarray = [];
      for (let file of imageFiles) {
        try {
          const fileStoredpublic_id = await uploadToCloudinary(file.path);
          ImageUrlarray.push(fileStoredpublic_id.public_id);
        } catch (error) {
          throw new ApiError(500, error.message);
        }
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        product._id,
        {
          $set: {
            ...req.body,
            image: ImageUrlarray,
          },
        },
        { new: true, runValidators: true }
      );
      return res
        .status(200)
        .json(
          new ApiResponse(200, updateProduct, "Product updated successfully")
        );
    } catch (error) {
      throw new ApiError(500, error.message);
    }
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});
