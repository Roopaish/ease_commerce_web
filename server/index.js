import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

// import routes (name as you want cause they are default exports)
import productRoutes from "./routes/product.route.js";

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
app.use(cors());

// registering routes
app.use("/api/product", productRoutes);

// middleware to handle exception
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";

  return res.status(status).json({
    success: false,
    status, //eqv. status: status
    message,
  });
});

app.listen(8800, () => {
  connectDB();
  console.log("Connected to server!");
});
