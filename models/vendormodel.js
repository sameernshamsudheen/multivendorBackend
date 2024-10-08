import mongoose from "mongoose";
import slugify from "slugify";

const subscriptionSchema = new mongoose.Schema(
  {
    plan: {
      type: String,
      enum: ["basic", "premium"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);
const vendorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    storeName: {
      type: String,
      required: true,
      unique: true,
    },
    storeSlug: {
      type: String,
      unique: true,
    },
    storeDescription: {
      type: String,
      required: true,
    },
    storeImage: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    subscription: subscriptionSchema,
  },
  { timeStamps: true }
);
vendorSchema.pre("save", function (next) {
  if (this.isModified("storeName")) {
    // Only generate slug if storeName is modified
    this.storeSlug = slugify(this.storeName, { lower: true, strict: true });
  }
  next();
});
export const Vendor = mongoose.model("Vendor", vendorSchema);
