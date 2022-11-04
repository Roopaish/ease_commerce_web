import express from "express";
import { signin, signup } from "../controllers/auth.controller.js";

const router = express.Router();

// CREATE A USER
router.post("/signup", signup);

// SIGN IN
router.post("/signin", signin);

export default router;
