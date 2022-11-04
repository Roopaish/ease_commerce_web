import express from "express";
import {
  deleteComparisons,
  deleteProduct,
  saveComparisons,
  saveProduct
} from "../controllers/user.controller.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

router.post("/product/:id", verifyToken, saveProduct);

router.delete("/product/:id", verifyToken, deleteProduct);

router.post("/comparison/:id", verifyToken, saveComparisons);

router.delete("/comparison/:id", verifyToken, deleteComparisons);

export default router;
