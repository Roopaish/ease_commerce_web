import { createError } from "../error.js";
import User from "../models/user.model.js";

export const saveProduct = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const user = await User.findById(req.params.id);
      const product = user.products.find(
        (product) => product.id === req.body.id
      );
      if (product) return next(createError(400, "Product already exists!"));

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $addToSet: { products: req.body },
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You can update only your account!"));
  }
};

export const deleteProduct = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $pull: { products: { id: req.body.id } },
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You can update only your account!"));
  }
};

export const saveComparisons = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $addToSet: { comparisons: req.body },
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You can update only your account!"));
  }
};

export const deleteComparisons = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $pull: { comparisons: { _id: req.body.id } },
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You can update only your account!"));
  }
};
