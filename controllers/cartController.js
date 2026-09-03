import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Récupérer le panier de l'utilisateur
export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price image stock"
    );

    if (!cart) {
      cart = { items: [], total: 0 };
    } else {
      // Calculer le total (on ignore les produits supprimés entre-temps)
      cart = cart.toObject();
      cart.items = cart.items.filter((item) => item.product);
      cart.total = cart.items.reduce((sum, item) => {
        return sum + item.product.price * item.quantity;
      }, 0);
    }

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// Ajouter un produit au panier
export const addToCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity = 1 } = req.body;

    // Vérifier que le produit existe
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produit non trouvé",
      });
    }

    // Trouver ou créer le panier
    let cart = await Cart.findOne({ user: req.user._id });

    // Quantité déjà présente dans le panier pour ce produit
    const itemIndex = cart
      ? cart.items.findIndex((item) => item.product.toString() === productId)
      : -1;
    const existingQuantity = itemIndex > -1 ? cart.items[itemIndex].quantity : 0;

    // Vérifier le stock (quantité déjà dans le panier + nouvelle quantité)
    if (product.stock < existingQuantity + quantity) {
      return res.status(400).json({
        success: false,
        message: "Stock insuffisant",
      });
    }

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity }],
      });
    } else if (itemIndex > -1) {
      // Mettre à jour la quantité
      cart.items[itemIndex].quantity += quantity;
      await cart.save();
    } else {
      // Ajouter le nouveau produit
      cart.items.push({ product: productId, quantity });
      await cart.save();
    }

    await cart.populate("items.product", "name price image stock");

    res.status(200).json({
      success: true,
      message: "Produit ajouté au panier",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// Modifier la quantité d'un produit
export const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantité invalide",
      });
    }

    // Vérifier le stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produit non trouvé",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Stock insuffisant",
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Panier non trouvé",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Produit non trouvé dans le panier",
      });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate("items.product", "name price image stock");

    res.status(200).json({
      success: true,
      message: "Quantité mise à jour",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// Supprimer un produit du panier
export const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Panier non trouvé",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate("items.product", "name price image stock");

    res.status(200).json({
      success: true,
      message: "Produit retiré du panier",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// Vider le panier
export const clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(200).json({
      success: true,
      message: "Panier vidé",
      data: { items: [], total: 0 },
    });
  } catch (error) {
    next(error);
  }
};

