import mongoose from "mongoose";
import slugify from "slugify";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    logo: String,

    brandSlug: {
      type: String,

      unique: true,
    },
  },

  { timeStamps: true }
);
brandSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.brandSlug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});
export const Brand = mongoose.model("Brand", brandSchema);
