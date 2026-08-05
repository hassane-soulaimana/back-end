import Product from "../models/Product.js";

const productNotFound = (res) =>
  res.status(404).json({ success: false, message: "Produit non trouvé" });

//Récupérer tous les produits
export const getAllProducts = async (req, res, next) => {
  try {
    const { universe, category, featured, search, sort, limit } = req.query;

    // Construction de la requête avec filtres
    let query = {};

    if (universe) query.universe = universe;
    if (category) query.category = category;
    if (featured) query.featured = featured === "true";
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Exécution de la requête
    let productsQuery = Product.find(query)
      .populate("universe", "name image")
      .populate("category", "name");

    // Tri
    if (sort === "price-asc") productsQuery = productsQuery.sort({ price: 1 });
    if (sort === "price-desc")
      productsQuery = productsQuery.sort({ price: -1 });
    if (sort === "newest")
      productsQuery = productsQuery.sort({ createdAt: -1 });

    // Limite
    if (limit) productsQuery = productsQuery.limit(parseInt(limit));

    const products = await productsQuery;

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

//  Récupérer un produit par ID
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("universe")
      .populate("category");

    if (!product) return productNotFound(res);

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Créer un nouveau produit
export const createProduct = async (req, res, next) => {
  try {
    const { name, price, description, category, universe, image } = req.body;
    const errors = [];

    if (!name) errors.push("Le nom est obligatoire");
    if (price === undefined) errors.push("Le prix est obligatoire");
    else {
      const parsedPrice = Number(price);
      if (Number.isNaN(parsedPrice) || parsedPrice < 0)
        errors.push("Le prix doit être un nombre positif");
    }
    if (!description) errors.push("La description est obligatoire");
    if (!category) errors.push("La catégorie est obligatoire");
    if (!universe) errors.push("L'univers est obligatoire");
    if (!image) errors.push("L'image est obligatoire");

    if (errors.length)
      return res
        .status(400)
        .json({ success: false, message: "Erreur de validation", errors });

    const productData = { ...req.body, price: Number(price) };
    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: "Produit créé avec succès",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

//Mettre à jour un produit
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Retourne le document mis à jour
      runValidators: true, // Exécute les validations du schéma
    });

    if (!product) return productNotFound(res);

    res.status(200).json({
      success: true,
      message: "Produit mis à jour",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

//  Supprimer un produit
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) return productNotFound(res);

    res.status(200).json({
      success: true,
      message: "Produit supprimé",
    });
  } catch (error) {
    next(error);
  }
};

//Récupérer les produits en vedette
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ featured: true })
      .populate("universe", "name")
      .populate("category", "name")
      .limit(8);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};
