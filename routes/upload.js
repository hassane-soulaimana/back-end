import express from "express";
import { upload } from "../middleware/upload.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/upload - Upload une image (admin seulement)
router.post("/", protect, authorize("admin"), upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Aucune image envoyée" });
  }

  // Retourne le chemin de l'image
  const imageUrl = `/images/${req.file.filename}`;

  res.status(201).json({
    success: true,
    message: "Image uploadée",
    data: {
      filename: req.file.filename,
      url: imageUrl,
    },
  });
});

export default router;