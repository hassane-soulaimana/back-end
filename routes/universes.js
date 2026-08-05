import express from "express";
import {
  getAllUniverses,
  getUniverseById,
  getProductsByUniverse,
  createUniverse,
  updateUniverse,
  deleteUniverse,
} from "../controllers/universeController.js";
// ADDED
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes publiques
router.get("/", getAllUniverses);
router.get("/:id", getUniverseById);
router.get("/:id/products", getProductsByUniverse);

// Routes admin (protégées)
router.post("/", protect, authorize("admin"), createUniverse);
router.put("/:id", protect, authorize("admin"), updateUniverse);
router.delete("/:id", protect, authorize("admin"), deleteUniverse);

export default router;
