import asyncHandler from "../../utils/asyncHandler.js";

import ApiError from "../../utils/apierror.js";

import { ApiResponse } from "../../utils/apiresponse.js";
import { Review } from "../../models/reviewmodel.js";
// import { sendWebSocketNotification } from "../../websocket/notification.js";

export const AddAReview = asyncHandler(async (req, res, next) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      throw new ApiError(500, "User not found");
    }

    const newReview = await Review.create({
      ...req.body,
      user: req.user._id,
    });

    if (!newReview) {
      throw new ApiError(500, "review creation failed");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, newReview, "reviewCreated"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export const deleteReview = asyncHandler(async (req, res, next) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      throw new ApiError(500, "User not found");
    }

    const deletedReview = await Review.findByIdAndDelete(req.params.id);

    if (!deletedReview) {
      throw new ApiError(500, "review deletion failed");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, deletedReview, "review deleted"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export const updateReview = asyncHandler(async (req, res, next) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      throw new ApiError(500, "User not found");
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          ...req.body,
        },
      },
      { new: true, runValidators: true }
    );

    return res
      .status(200)
      .json(new ApiResponse(200,updatedReview, "review Updated"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});
