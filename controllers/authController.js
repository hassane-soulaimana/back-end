import User from "../models/User.js";
import Cart from "../models/Cart.js";
import Favorite from "../models/Favorite.js";

export const register = async (req, res, next) => {
  try {
    const { prenom, nom, email, password, confirmPassword } = req.body;

    // Validation des champs requis
    if (!prenom || !nom || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Veuillez remplir tous les champs obligatoires",
      });
    }

    // Vérifier que les mots de passe correspondent
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Les mots de passe ne correspondent pas",
      });
    }

    // Vérifier la longueur du mot de passe
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Le mot de passe doit contenir au moins 6 caractères",
      });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Cet email est déjà utilisé",
      });
    }

    // Créer le nouvel utilisateur
    const user = await User.create({
      prenom,
      nom,
      email,
      password,
      role: "user",
    });

    // Générer le token
    const token = user.generateAuthToken();

    res.status(201).json({
      success: true,
      message: "Inscription réussie",
      token,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

//  Changer le rôle d'un utilisateur
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const { id } = req.params;
    if (!role || !["user", "admin"].includes(role)) {
      return res.status(400).json({ success: false, message: "Rôle invalide" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }
    user.role = role;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Rôle mis à jour",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Veuillez fournir un email et un mot de passe",
      });
    }

    // Trouver l'utilisateur et inclure le mot de passe
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    }

    // Vérifier le mot de passe
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    }

    // Générer le token
    const token = user.generateAuthToken();

    res.status(200).json({
      success: true,
      message: "Connexion réussie",
      token,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

//  Récupérer le profil de l'utilisateur connecté

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Utilisateur non trouvé" });
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

//  Mettre à jour le profil

export const updateProfile = async (req, res, next) => {
  try {
    const { prenom, nom, email } = req.body;

    // Vérifier si l'email existe déjà pour un autre utilisateur
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Cet email est déjà utilisé",
        });
      }
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    // Mettre à jour les champs
    if (prenom) user.prenom = prenom;
    if (nom) user.nom = nom;
    if (email) user.email = email;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profil mis à jour",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

//  Changer le mot de passe
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Veuillez remplir tous les champs",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Les mots de passe ne correspondent pas",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Le mot de passe doit contenir au moins 6 caractères",
      });
    }

    // Récupérer l'utilisateur avec le mot de passe
    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    // Vérifier l'ancien mot de passe
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Mot de passe actuel incorrect",
      });
    }

    // Mettre à jour le mot de passe
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Mot de passe mis à jour avec succès",
    });
  } catch (error) {
    next(error);
  }
};

//  Récupérer tous les utilisateurs (admin)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

//  Supprimer un utilisateur (admin)
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Vous ne pouvez pas supprimer votre propre compte",
      });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }

    // Nettoyer les données liées (on garde les commandes pour l'historique/les stats)
    await Promise.all([
      Cart.deleteOne({ user: id }),
      Favorite.deleteMany({ user: id }),
    ]);

    res.status(200).json({ success: true, message: "Utilisateur supprimé" });
  } catch (error) {
    next(error);
  }
};
