/**
 * Categories Middlewares
 *
 * Contains middleware functions for category validation.
 *
 * @module modules/assetsModule/middlewares/categories-validator
 */

const { response } = require("express");
const Categories = require("../models/Categories");

/**
 * Middleware to validate if a category already exists in the database
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Function} next Next function in the middleware chain
 */
const categoryAlreadyExists = async (req, res = response, next) => {
  const categoryTitle = req.body;
  console.log(categoryTitle);

  const categories = await Categories.find();

  const category = categories.find(
    (category) => category.title === categoryTitle
  );

  if (category) {
    return res.status(404).json({
      ok: false,
      msg: "Category with that name already exists",
    });
  }

  next();
};

const categoryExists = async (req, res = response, next) => {
  const categoryId = req.params.id;

  const category = await Categories.findById(categoryId);

  if (!category) {
    return res.status(404).json({
      ok: false,
      msg: "Category not found",
    });
  }

  next();
};

module.exports = {
  categoryAlreadyExists,
  categoryExists,
};
