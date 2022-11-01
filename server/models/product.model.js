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
    nid: {
      type: String,
    },
    sellerName: {
      type: Number,
    },
    description: {
      type: [String],
    },
    productUrl: {
      type: String,
    },
    price: {
      type: Number,
    },
    ratingScore: {
      type: Number,
    },
    review: {
      type: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
