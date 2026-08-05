import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
} from "../controllers/orderController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes utilisateur
router.post("/", protect, createOrder);
router.get("/", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

// Routes admin
router.get("/admin/all", protect, authorize("admin"), getAllOrders);
router.get("/admin/stats", protect, authorize("admin"), getOrderStats);
router.patch("/admin/:id/status", protect, authorize("admin"), updateOrderStatus);

export default router;