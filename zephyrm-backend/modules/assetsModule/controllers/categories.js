/**
 * Categories Controller
 *
 * Contains the controllers for category management.
 *
 * @module modules/assetsModule/controllers/categories
 */

const { response } = require("express");

const Categories = require("../models/Categories");

/**
 * Get all categories
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Promise<void>} - Sends a JSON response with the status and all the categories.
 *                            Responds with status 200 and the categories if successful.
 *                            If an error occurs, responds with status 500 and an error message.
 */
const getCategories = async (req, res = response) => {
  try {
    const categories = await Categories.find().populate("title");

    res.status(200).json({
      ok: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error getting categories",
    });
  }
};

/**
 * Creates a new category in the database.
 *
 * @param {Object} req - The request object containing category data in the body.
 * @param {Object} res - The response object used to send back the HTTP response.
 *
 * @returns {Promise<void>} - Sends a JSON response with the status and the created category.
 *                            Responds with status 201 and the saved category if successful.
 *                            If an error occurs, responds with status 400 and an error message.
 */

const createCategory = async (req, res = response) => {
  const category = new Categories(req.body);
  console.log(category);

  try {
    const saveCategory = await category.save();
    res.status(201).json({
      ok: true,
      saveCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      msg: "Error creating category",
    });
  }
};

/**
 * Deletes a category from the database with the given ID.
 *
 * @param {Object} req - The request object containing the category ID in the URL
 *                       parameters.
 * @param {Object} res - The response object used to send back the HTTP response.
 *
 * @returns {Promise<void>} - Sends a JSON response with the status.
 *                            Responds with status 200 if the category is deleted successfully.
 *                            If an error occurs, responds with status 400 and an error message.
 */
const deleteCategory = async (req, res = response) => {
  const categoryId = req.params.id;

  try {
    await Categories.findByIdAndDelete(categoryId);

    res.status(200).json({
      ok: true,
      msg: "Category deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: "Error deleting category",
    });
  }
};

module.exports = {
  createCategory,
  deleteCategory,
  getCategories,
};
