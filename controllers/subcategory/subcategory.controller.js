import asyncHandler from "../../utils/asyncHandler.js";

import ApiError from "../../utils/apierror.js";

import { ApiResponse } from "../../utils/apiresponse.js";

import { SubCategory } from "../../models/subcategorymodal.js";
export const createASubcategory = asyncHandler(async (req, res, next) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      throw new ApiError(500, "User not found");
    }

    const { name, description } = req.body;
    const newSubCategory = await SubCategory.create({
      name: name,
      description: description,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, newSubCategory, "created a subCategory"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});
export const getAllSubCategory = asyncHandler(async (req, res, next) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      throw new ApiError(500, "User not found");
    }

    const subCategory = await SubCategory.find();
    return res
      .status(200)
      .json(new ApiResponse(200, subCategory, "fetched all subcategory"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export const updateSubCategory = asyncHandler(async (req, res, next) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      throw new ApiError(500, "User not found");
    }

    const subCategory = await SubCategory.findById(req.params.id);
    if (!subCategory) {
      throw new ApiError(500, "subcategory not found");
    }

    const updatedSubcategory = await SubCategory.findByIdAndUpdate(
      subCategory._id,
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
        new ApiResponse(
          200,
          updatedSubcategory,
          " subcategory updated successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export const deleteSubcategory = asyncHandler(async (req, res, next) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      throw new ApiError(500, "User not found");
    }

    const subcategory = await SubCategory.findOne({ _id: req.params.id });

    if (!subcategory) {
      throw new ApiError(500, "Product not found");
    }

    const deletedSubCategory = await SubCategory.findByIdAndDelete(
      req.params.id
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          deleteSubcategory,
          "subcategory deleted successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});
export const getSubcategoryBySlug = asyncHandler(async (req, res, next) => {
  const currentUser = req.user;

  if (!currentUser) {
    throw new ApiError(500, "Invalid  user");
  }

  const subCategoryBySlug = await SubCategory.findOne({
    slug: req.params.slug,
  });
  if (!subCategoryBySlug) {
    throw new ApiError(500, "SubCategory not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, subCategoryBySlug, "Fetched Brand by slug"));
});
