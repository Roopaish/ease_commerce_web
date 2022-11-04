import mongoose from "mongoose";
import Product from "./product.model.js";

const ComparisonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  products: [Product.schema],
});

export default mongoose.model("Comparison", ComparisonSchema);