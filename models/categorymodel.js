import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    parentCategory: {
      type: mongoose.schema.types.objectId,
      ref: "Category",
    },
    subCategory: {
      type: mongoose.schema.types.objectId,
      ref: "Category",
    },
  },
  { timeStamps: true }
);

export const Category = mongoose.model("category", categorySchema);
