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

// Récupérer mes favoris
router.get("/", getMyFavorites);

// Ajouter un favori
router.post("/:productId", addFavorite);

// Supprimer un favori
router.delete("/:productId", removeFavorite);

// Vérifier si un produit est en favori
router.get("/check/:productId", checkFavorite);

// Toggle favori
router.put("/toggle/:productId", toggleFavorite);

export default router;
