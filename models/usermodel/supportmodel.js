import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.types.objectId,
    ref: "User",
    required: true,
  },

  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.Now(),
  },
},{_id:false});

const supportSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ["open", "in_progress", "closed"],
      default: "open",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    category: String,
    assignedTo: {
      type: mongoose.Schema.types.objectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
  },

  { timeStamps: true }
);

supportSchema.pre("save", async function (next) {
  this.updatedAt = new Date();
  next();
});

export const Support = mongoose.model("Support", supportSchema);
