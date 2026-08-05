import Category from "../models/Category.js";
import Product from "../models/Product.js";

const categoryNotFound = (res) =>
  res.status(404).json({ success: false, message: "Catégorie non trouvée" });

// Récupérer toutes les catégories
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// Récupérer une catégorie par ID
export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) return categoryNotFound(res);

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

//  Récupérer les produits d'une catégorie
export const getProductsByCategory = async (req, res, next) => {
  try {
    const products = await Product.find({
      category: req.params.id,
    }).populate("universe", "name");

    res.status(200).json({
      success: true,
      category: req.params.id,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// Créer une nouvelle catégorie
export const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      message: "Catégorie créée avec succès",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

//  Mettre à jour une catégorie
export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) return categoryNotFound(res);

    res.status(200).json({
      success: true,
      message: "Catégorie mise à jour",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// Supprimer une catégorie
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) return categoryNotFound(res);

    res.status(200).json({
      success: true,
      message: "Catégorie supprimée",
    });
  } catch (error) {
    next(error);
  }
};
