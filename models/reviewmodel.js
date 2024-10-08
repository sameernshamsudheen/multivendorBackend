import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
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
