import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

// import routes (name as you want cause they are default exports)
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import userRoutes from "./routes/user.route.js";

// initialization
const app = express();
dotenv.config();

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO)
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((e) => {
      throw e;
    });
};

// Take json as req body
app.use(express.json());

// Enable the use of cookies
app.use(cookieParser());

// Enable cors
app.use(
  cors({
    origin: true,
    credentials: true, // Allow requests with credentials (cookies, authorization headers, etc.)
    allowedHeaders: ["Set-Cookie"],
  })
);

// registering routes
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/user", userRoutes);

// middleware to handle exception
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";

  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.listen(process.env.PORT || 8800, () => {
  connectDB();
  console.log("Connected to server!");
});
