import Category from "../models/Category.js";
import Product from "../models/Product.js";

// @desc    Récupérer toutes les catégories
// @route   GET /api/categories
// @access  Public
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

// @desc    Récupérer une catégorie par ID
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Catégorie non trouvée",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Récupérer les produits d'une catégorie
// @route   GET /api/categories/:id/products
// @access  Public
export const getProductsByCategory = async (req, res, next) => {
  try {
    const products = await Product.find({ category: req.params.id }).populate(
      "universe",
      "name"
    );

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

// @desc    Créer une nouvelle catégorie
// @route   POST /api/categories
// @access  Private
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

// @desc    Mettre à jour une catégorie
// @route   PUT /api/categories/:id
// @access  Private
export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Catégorie non trouvée",
      });
    }

    res.status(200).json({
      success: true,
      message: "Catégorie mise à jour",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer une catégorie
// @route   DELETE /api/categories/:id
// @access  Private
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Catégorie non trouvée",
      });
    }

    res.status(200).json({
      success: true,
      message: "Catégorie supprimée",
    });
  } catch (error) {
    next(error);
  }
};
