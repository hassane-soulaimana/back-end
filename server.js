import "dotenv/config";
import http from "http";
import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error(" MONGODB_URI non défini");
  process.exit(1);
}

const server = http.createServer(app);

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connecté");

    server.listen(PORT, () => {
      console.log(` Serveur lancé sur le port ${PORT}`);
    });
  } catch (err) {
    console.error(" Erreur :", err.message);
    process.exit(1);
  }
}

startServer();

process.on("SIGINT", async () => {
  await mongoose.disconnect();
  console.log(" MongoDB déconnecté");
  process.exit(0);
});