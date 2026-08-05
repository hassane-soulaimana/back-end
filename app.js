import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.js";

import authRoutes from "./routes/auth.js";
import productsRoutes from "./routes/products.js";
import categoriesRoutes from "./routes/categories.js";
import universesRoutes from "./routes/universes.js";
import favoritesRoutes from "./routes/favorites.js";
import uploadRoutes from "./routes/upload.js";
import cartRoutes from "./routes/cart.js";
import ordersRoutes from "./routes/orders.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ CORS global
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://apianime.alwaysdata.net',
    'https://hassane-soulaimana.students-laplateforme.io'
  ],
  credentials: true
}));

// ✅ Servir les images avec headers CORS
app.use("/images", express.static(path.join(__dirname, "public/images"), {
  setHeaders: (res) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Access-Control-Allow-Origin', '*');
  }
}));

app.use(helmet());
app.use(express.json({ limit: "10kb" }));
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

// Routes
app.get("/", (req, res) => {
  res.json({ success: true, message: "API Echecs Mangas" });
});

app.get('/health', (req, res) => {
  return res.status(200).json({ success: true, status: 'ok' });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/universes", universesRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", ordersRoutes);
import usersRoutes from "./routes/users.js";
app.use("/api/users", usersRoutes);

// 404
app.use((req, res) => res.status(404).json({ success: false, message: "Not Found" }));

// Error handler
app.use(errorHandler);

export default app;