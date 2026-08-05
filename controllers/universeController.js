import Universe from "../models/Universe.js";
import Product from "../models/Product.js";

//Récupérer tous les univers
export const getAllUniverses = async (req, res, next) => {
  try {
    const universes = await Universe.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: universes.length,
      data: universes,
    });
  } catch (error) {
    next(error);
  }
};

//Récupérer un univers par ID
export const getUniverseById = async (req, res, next) => {
  try {
    const universe = await Universe.findById(req.params.id);

    if (!universe) {
      return res.status(404).json({
        success: false,
        message: "Univers non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      data: universe,
    });
  } catch (error) {
    next(error);
  }
};

// Récupérer les produits d'un univers
export const getProductsByUniverse = async (req, res, next) => {
  try {
    const products = await Product.find({ universe: req.params.id }).populate(
      "category",
      "name"
    );

    res.status(200).json({
      success: true,
      universe: req.params.id,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// Créer un nouvel univers
export const createUniverse = async (req, res, next) => {
  try {
    const universe = await Universe.create(req.body);

    res.status(201).json({
      success: true,
      message: "Univers créé avec succès",
      data: universe,
    });
  } catch (error) {
    next(error);
  }
};

//Mettre à jour un univers
export const updateUniverse = async (req, res, next) => {
  try {
    const universe = await Universe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!universe) {
      return res.status(404).json({
        success: false,
        message: "Univers non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      message: "Univers mis à jour",
      data: universe,
    });
  } catch (error) {
    next(error);
  }
};

//Supprimer un univers
export const deleteUniverse = async (req, res, next) => {
  try {
    const universe = await Universe.findByIdAndDelete(req.params.id);

    if (!universe) {
      return res.status(404).json({
        success: false,
        message: "Univers non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      message: "Univers supprimé",
    });
  } catch (error) {
    next(error);
  }
};
