import asyncHandler from "../../utils/asyncHandler.js";

import ApiError from "../../utils/apierror.js";

import { ApiResponse } from "../../utils/apiresponse.js";
import { Wishlist } from "../../models/wishlistmodel.js";

export const AddToWhishlist = asyncHandler(async (req, res, next) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      throw new ApiError(500, "User not found");
    }

    const { productId } = req.body;
    const wishlist = await Wishlist.findOne({ user: currentUser._id });

    if (!wishlist) {
      // If wishlist doesn't exist, create a new wishlist with the product added
      const newWishlist = new Wishlist({
        user: currentUser._id,
        products: [productId],
      });
      await newWishlist.save();
    //   sendWebSocketNotification(
    //     currentUser._id,
    //     `Product ${productId} was added to your wishlist.`
    //   );
      return res
        .status(200)
        .json(
          new ApiResponse(200, newWishlist, "Added Products to the  wishlist")
        );
    }

    // If the product already exists in the wishlist, throw an error
    if (wishlist.products.includes(productId)) {
      throw new ApiError(500, "Product already exists in wishlist");
    }

    // If wishlist exists and product is not in it, add the product
    wishlist.products.push(productId);
    await wishlist.save();
    return wishlist;
    return res
      .status(200)
      .json(
        new ApiResponse(200, newWishList, "Added Products to the  wishlist")
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export const RemoveFromWhishlist = asyncHandler(async (req, res, next) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      throw new ApiError(500, "User not found");
    }

    const { productId } = req.body;
    const wishlist = await Wishlist.findOne({ user: currentUser._id });

    if (!wishlist) {
      // If wishlist doesn't exist, create a new wishlist with the product added
      throw new ApiError(500, "whishlist not found");
    }

    // If the product already exists in the wishlist, throw an error
    if (!wishlist.products.includes(productId)) {
      throw new ApiError(500, "Product not  found in  wishlist");
    }

    // If wishlist exists and product is not in it, add the product
    wishlist.products.pull(productId);
    await wishlist.save();

    return res
      .status(200)
      .json(
        new ApiResponse(200, wishlist, "deleted a Product from the  wishlist")
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});
export const getWhishlist = asyncHandler(async (req, res, next) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      throw new ApiError(500, "User not found");
    }

    const { productId } = req.body;
    const wishlist = await Wishlist.findOne({ user: currentUser._id }).populate(
      "products"
    );

    return res
      .status(200)
      .json(new ApiResponse(200, wishlist, " fetched wishlist"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});
