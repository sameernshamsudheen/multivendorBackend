import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.types.objectId,
      ref: "Product",
      required: true,
    },
  },
  { _id: false, timeStamps: true }
);

const cancellationSchema = new mongoose.Schema(
  {
    reason: {
      type: String,

      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { _id: false }
);

const returnSchema = new mongoose.Schema(
  {
    reason: {
      type: String,

      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.types.objectId,
      ref: "User",
      required: true,
    },

    items: [orderItemSchema],
    products: [
      {
        type: mongoose.Schema.types.objectId,
        ref: "Product",
      },
    ],
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    address: {
      street: String,
      city: String,
      zip: Number,
      state: String,
      country: String,
    },
    paymentMethod: {
      type: String,
      enum: ["card", "paypal", "cash_on_delivery"],
      required: true,
    },
    cancellation: cancellationSchema,
    return: returnSchema,
  },

  { timeStamps: true }
);

export const Wishlist = mongoose.model("Order", orderSchema);
