import asyncHandler from "../../utils/asyncHandler.js";

import ApiError from "../../utils/apierror.js";

import { ApiResponse } from "../../utils/apiresponse.js";
import { Category } from "../../models/categorymodel.js";

export const createACategory = asyncHandler(async (req, res, next) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      throw new ApiError(500, "User not found");
    }

    const { name, description } = req.body;
    const category = await Category.create({
      name: name,
      description: description,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, category, "created a Category"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});
export const getAllCategory = asyncHandler(async (req, res, next) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      throw new ApiError(500, "User not found");
    }

    const category = await Category.find();
    return res
      .status(200)
      .json(new ApiResponse(200, category, "fetched all category"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export const updateCategory = asyncHandler(async (req, res, next) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      throw new ApiError(500, "User not found");
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      throw new ApiError(500, "subcategory not found");
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      category._id,
      {
        $set: {
          ...req.body,
        },
      },
      { new: true, runValidators: true }
    );
    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedCategory, " category updated successfully")
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export const deleteCategory = asyncHandler(async (req, res, next) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      throw new ApiError(500, "User not found");
    }

    const category = await Category.findOne({ _id: req.params.id });

    if (!category) {
      throw new ApiError(500, "category not found");
    }

    const deletedCategory = await Category.findByIdAndDelete(req.params.id);

    return res
      .status(200)
      .json(
        new ApiResponse(200, deletedCategory, "category deleted successfully")
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});
export const getCategoryBySlug = asyncHandler(async (req, res, next) => {
  const currentUser = req.user;

  if (!currentUser) {
    throw new ApiError(500, "Invalid  user");
  }

  const CategoryBySlug = await Category.findOne({
    slug: req.params.slug,
  });
  if (!CategoryBySlug) {
    throw new ApiError(500, "Category not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, CategoryBySlug, "Fetched Categories by slug"));
});
