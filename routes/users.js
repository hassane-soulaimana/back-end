import express from "express";
import { getAllUsers, deleteUser } from "../controllers/authController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route pour récupérer tous les utilisateurs
router.get("/", protect, authorize("admin"), getAllUsers);

// Route pour supprimer un utilisateur
router.delete("/:id", protect, authorize("admin"), deleteUser);

export default router;
