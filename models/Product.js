import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom du produit est obligatoire"],
      trim: true,
      maxlength: [100, "Le nom ne peut pas dépasser 100 caractères"],
    },
    price: {
      type: Number,
      required: [true, "Le prix est obligatoire"],
      min: [0, "Le prix ne peut pas être négatif"],
    },
    description: {
      type: String,
      required: [true, "La description est obligatoire"],
      maxlength: [1000, "La description ne peut pas dépasser 1000 caractères"],
    },
    image: {
      type: String,
      required: [true, "L'image est obligatoire"],
    },
    stock: {
      type: Number,
      required: true,
      min: [0, "Le stock ne peut pas être négatif"],
      default: 0,
    },
    universe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Universe",
      required: [true, "L'univers est obligatoire"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "La catégorie est obligatoire"],
    },
    featured: {
      type: Boolean,
      default: false, // Pour marquer les produits à la une
    },
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
