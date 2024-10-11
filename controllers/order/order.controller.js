import asyncHandler from "../../utils/asyncHandler.js";

import ApiError from "../../utils/apierror.js";

import { ApiResponse } from "../../utils/apiresponse.js";

import { Order } from "../../models/ordermodel.js";
import razorpay from "../../utils/payment.js";

export const createOrder = asyncHandler(async (req, res, next) => {
  try {
    const { productId, items, currency, receipt } = req.body;

    const initialValue = 0;
    const totalprice = await items.reduce((accumulator, item) => {
      return accumulator + item.price * item.quantity;
    }, initialValue);

    const orderCreateDb = await Order.create({
      user: req.user._id,
      items: [...items],
      totalprice: totalprice,
    });

    if (!orderCreateDb) {
      throw new ApiError(500, "Error creating order", error.message);
    }

    const options = {
      amount: orderCreateDb.totalprice, // Convert to paise for Razorpay
      currency: currency || "INR",
      receipt: receipt || `receipt_order_${new Date().getTime()}`,
      notes: {
        // optional: add item details in notes
        items: JSON.stringify(orderCreateDb.items), // store items as JSON string in notes
      },
    };

    const orders = await razorpay.orders.create(options);

 

    if (!orders) {
      throw new ApiError(500, "Error creating order", error.message);
    }

    return res
      .status(200)
      .json(new ApiResponse(200, orders, "Order created successfully"));
  } catch (error) {
    console.error("Order creation error:", error);
    throw new ApiError(500, "something went wrong", error.message);
  }
});

export const getAllOrders = asyncHandler(async (req, res, next) => {
  try {
    const allOrders = await Order.find();
    if (!allOrders) {
      throw new ApiError(500, "Orders not Found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, allOrders, "fetched all orders successfully"));
  } catch (error) {
    throw new ApiError(500, "something went wrong", error.message);
  }
});

export const getOrdersByid = asyncHandler(async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      throw new ApiError(500, "Orders not Found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, order, "Order succesfully fetched"));
  } catch (error) {
    throw new ApiError(500, "something went wrong", error.message);
  }
});

export const orderStatusUpdate = asyncHandler(async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      throw new ApiError(500, "Orders not Found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, order, "Order status updated succesfully"));
  } catch (error) {
    throw new ApiError(500, "something went wrong", error.message);
  }
});

export const orderCancellation = asyncHandler(async (req, res, next) => {
  try {
    const { reason } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelled", cancellation: { reason, createdAt: new Date() } },
      { new: true }
    );

    if (!order) {
      throw new ApiError(500, "Orders not Found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, order, "Order  cancelled successfully"));
  } catch (error) {
    throw new ApiError(500, "something went wrong", error.message);
  }
});

export const orderReturn = asyncHandler(async (req, res, next) => {
  try {
    const { reason } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { return: { reason, status: "pending", createdAt: new Date() } },
      { new: true }
    );

    if (!order) {
      throw new ApiError(500, "Orders not Found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, order, "Order  cancelled successfully"));
  } catch (error) {
    throw new ApiError(500, "something went wrong", error.message);
  }
});

export const orderReturnStatus = asyncHandler(async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, "return.status": "pending" },
      { "return.status": status },
      { new: true }
    );

    if (!order) {
      throw new ApiError(500, "Orders not Found  or return already proccessed");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, order, "Order  returned successfully"));
  } catch (error) {
    throw new ApiError(500, "something went wrong", error.message);
  }
});
