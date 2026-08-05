import mongoose from "mongoose";

const UniverseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom de l'univers est obligatoire"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Universe =
  mongoose.models.Universe || mongoose.model("Universe", UniverseSchema);

export default Universe;
