import mongoose from "mongoose";
import slugify from "slugify";

const SubcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: String,
    description: String,
  },
  { timeStamps: true }
);
SubcategorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});
export const SubCategory = mongoose.model("Subcategory", SubcategorySchema);
