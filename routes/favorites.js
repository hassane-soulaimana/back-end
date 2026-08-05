import express from "express";
import {
  getMyFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
  toggleFavorite,
} from "../controllers/favoriteController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Toutes les routes sont protégées (utilisateur connecté)
router.use(protect);

// GET /api/favorites - Récupérer mes favoris
router.get("/", getMyFavorites);

// POST /api/favorites/:productId - Ajouter un favori
router.post("/:productId", addFavorite);

// DELETE /api/favorites/:productId - Supprimer un favori
router.delete("/:productId", removeFavorite);

// GET /api/favorites/check/:productId - Vérifier si un produit est en favori
router.get("/check/:productId", checkFavorite);

// PUT /api/favorites/toggle/:productId - Toggle favori
router.put("/toggle/:productId", toggleFavorite);

export default router;
