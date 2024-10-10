import express from "express";

import isAuthenticated from "../middleware/isauthenticated.js";

import authorize from "../middleware/authorize.js";
import {
  createOrder,
  getAllOrders,
  getOrdersByid,
} from "../controllers/order/order.controller.js";

const OrderRouter = express.Router();

OrderRouter.post(
  "/order-create",
  isAuthenticated,

  createOrder
);
OrderRouter.get(
  "/order-all",
  isAuthenticated,

  getAllOrders
);
OrderRouter.get(
  "/order/:id",
  isAuthenticated,

  getOrdersByid
);
// Order.put(
//   "/category-update/:id",
//   isAuthenticated,

//   updateCategory
// );
// Order.get("/category-slug/:slug", isAuthenticated, getCategoryBySlug);

// Order.delete(
//   "/category-delete/:id",
//   isAuthenticated,

//   deleteCategory
// );

export default OrderRouter;
