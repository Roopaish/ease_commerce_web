import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },
    priceShow: {
      type: String,
    },
    name: {
      type: String,
    },
    id: {
      type: String,
    },
    sellerName: {
      type: String,
    },
    description: {
      type: [String],
    },
    productUrl: {
      type: String,
    },
    price: {
      type: String,
    },
    ratingScore: {
      type: String,
    },
    review: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
