import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.types.Objectid,
      ref: "User",
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.types.objectId,
        ref: "Product",
      },
    ],
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: String,
    vendorReply: {
      type: Date,
      default: Date.now(),
    },
  },
  { timeStamps: true }
);

reviewSchema.index({ user: 1, product: 1 }, { unique: true });

export const Review = mongoose.model("Review", reviewSchema);
