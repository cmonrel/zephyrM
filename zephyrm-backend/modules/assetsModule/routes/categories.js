/**
 * Categories Routes
 *
 * Sets up the routes for category management.
 * host + /api/categories
 *
 * @module modules/assetsModule/routes/categories
 */

const { Router } = require("express");
const { check } = require("express-validator");

const { validateJWT } = require("../../../middlewares/jwt-validator");
const { fieldsValidator } = require("../../../middlewares/fields-validator");

const {
  getCategories,
  createCategory,
  deleteCategory,
} = require("../controllers/categories");
const {
  categoryExists,
  categoryAlreadyExists,
} = require("../middlewares/categories-validator");

const router = Router();

// All routes need JWT verification
router.use(validateJWT);

// GET categories
router.get("/", getCategories);

// POST category
router.post(
  "/new",
  [
    check("title", "Title is required").not().isEmpty(),
    fieldsValidator,
    categoryAlreadyExists,
  ],
  createCategory
);

// DELETE category
router.delete("/:id", categoryExists, deleteCategory);

module.exports = router;
