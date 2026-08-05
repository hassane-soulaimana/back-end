import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const { Schema, model, models } = mongoose;

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined.");
}

const UserSchema = new Schema(
  {
    id_user: {
      type: String,
      unique: true,
    },

    prenom: {
      type: String,
      required: true,
      trim: true,
    },

    nom: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Email invalide"],
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * Supprime le mot de passe lors de la conversion en JSON
 */
UserSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.password;
    return ret;
  },
});

/**
 * Hash du mot de passe avant l'enregistrement
 */
UserSchema.pre("save", async function (next) {
  try {
    if (!this.id_user) {
      this.id_user = this._id.toString();
    }

    if (!this.isModified("password")) {
      return next();
    }

    const salt = await bcrypt.genSalt(
      Number(process.env.SALT_ROUNDS) || 10
    );

    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Vérifie le mot de passe
 */
UserSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

/**
 * Génère un JWT
 */
UserSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
    },
    JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES || "7d",
    }
  );
};

const User = models.User || model("User", UserSchema);

export default User;