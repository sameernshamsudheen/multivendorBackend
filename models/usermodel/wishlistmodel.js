import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.types.objectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.types.objectId,
        ref: "Product",
      },
    ],
  },
  { timeStamps: true }
);

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);
