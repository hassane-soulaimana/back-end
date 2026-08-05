import express from "express";
import * as productController from "../controllers/productController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes publiques
router.get("/", productController.getAllProducts);
router.get("/featured", productController.getFeaturedProducts);
router.get("/:id", productController.getProductById);

// Routes admin
router.post("/", protect, authorize("admin"), productController.createProduct);
router.put("/:id", protect, authorize("admin"), productController.updateProduct);
router.delete("/:id", protect, authorize("admin"), productController.deleteProduct);

export default router;
