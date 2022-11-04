import mongoose from "mongoose";
import Comparison from "./comparison.model.js";
import Product from "./product.model.js";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    products: [Product.schema],
    comparisons: [Comparison.schema],
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
