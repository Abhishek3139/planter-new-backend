import mongoose from "mongoose";
import { Schema } from "mongoose";

export interface Plant extends Document {
  name: string;
  scientificName: string;
  price: number;
  description: string;
  image: string;
  category: "houseplant" | "succulent" | "outdoor" | "flowering";
  careLevel: "easy" | "medium" | "hard";
  light: "low" | "medium" | "bright";
  water: "low" | "medium" | "high";
  humidity: "low" | "medium" | "high";
  petFriendly: boolean;
  inStock: number;
  featured: boolean;
}

const plantSchema: Schema<Plant> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Plant name is required."],
    },
    scientificName: String,
    price: {
      type: Number,
      required: [true, "Price is required."],
    },
    inStock: {
      type: Number,
      required: [true, "InStock is required."],
    },
    description: {
      type: String,
      required: [true, "Description is required."],
    },
    petFriendly: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      required: [true, "Image is required."],
    },
    category: String,
    careLevel: String,
    light: String,
    water: String,
    humidity: String,
  },
  { timestamps: true }
);

export const PlantModel = mongoose.model<Plant>("Plant", plantSchema);
