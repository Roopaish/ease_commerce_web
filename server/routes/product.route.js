import express from "express";
import { getDarazProducts, getAmazonProducts } from "../controllers/product.controller.js";

const router = express.Router();

router.get("/daraz/:product", getDarazProducts);

router.get("/amazon/:product", getAmazonProducts);

export default router;
