// Corrige le champ "image" des 8 produits dont l'image ne s'affichait pas.
// Lancer une seule fois :  node fix-product-images.js
// (utilise le MONGODB_URI du .env, donc la même base Atlas)
import "dotenv/config";
import mongoose from "mongoose";

// [ morceau du nom du produit , nouveau chemin d'image ]
const updates = [
  // 3 produits Demon Slayer : l'image existe déjà sur le serveur sous un autre nom
  [/Piliers vs Lunes/i,        "/images/products/demonslayer-pieces-piliers-vs-lunes.jpg"],
  [/Montagne Natagumo/i,       "/images/products/demonslayer-plateau-tatami.jpg"],
  [/Tanjiro & Nezuko/i,        "/images/products/demonslayer-pieces-masques-forgerons.jpg"],

  // 5 produits génériques : nouveaux visuels provisoires (SVG)
  [/Crossover Anime/i,         "/images/products/crossover-board.svg"],
  [/Découverte Débutant/i,     "/images/products/starter-pack.svg"],
  [/Villains Collection/i,     "/images/products/villains-pieces.svg"],
  [/Sacoche de Transport/i,    "/images/products/premium-bag.svg"],
  [/Échiquier LED/i,           "/images/products/led-board.svg"],
];

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const products = mongoose.connection.collection("products");

  for (const [rx, image] of updates) {
    const res = await products.updateOne({ name: { $regex: rx } }, { $set: { image } });
    console.log(`${image}  ->  ${res.matchedCount} trouvé, ${res.modifiedCount} modifié`);
  }

  await mongoose.disconnect();
  console.log("Terminé.");
}

run().catch((err) => {
  console.error("Erreur :", err.message);
  process.exit(1);
});
