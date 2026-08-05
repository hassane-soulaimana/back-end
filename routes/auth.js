import express from "express";
import { register, login, getProfile, updateProfile, updatePassword, updateUserRole } from "../controllers/authController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/password", protect, updatePassword);

// Route pour changer le rôle d'un utilisateur
router.put("/role/:id", protect, authorize("admin"), updateUserRole);

export default router;