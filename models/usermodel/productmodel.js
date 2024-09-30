import mongoose from "mongoose";

const productVariationSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    min: 0,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    vendor: {
      type: mongoose.Schema.types.ObjectId,
      ref: "Vendor",
    },
    category: {
      type: mongoose.Schema.types.ObjectId,
      ref: "Category",
    },
    subcategory: {
      type: mongoose.Schema.types.ObjectId,
      ref: "Category",
    },
    brand: {
      type: mongoose.Schema.types.ObjectId,
      ref: "Brand",
    },
    image: [String],
    variations: [productVariationSchema],
    ratingAverage: {
      type: Number,
      default: 0,
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
