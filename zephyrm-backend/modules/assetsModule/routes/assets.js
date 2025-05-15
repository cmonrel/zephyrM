/* 
    CRUD  Assets
    Assets Routes
    host + /api/assets
*/

const { Router } = require("express");
const { check } = require("express-validator");

const { isDate } = require("../../../helpers/isDate");
const { validateJWT } = require("../../../middlewares/jwt-validator");
const { fieldsValidator } = require("../../../middlewares/fields-validator");

const {
  getAssets,
  createAsset,
  updateAsset,
  deleteAsset,
  assignUserToAsset,
  downloadAssetFile,
} = require("../controllers/assets");
const { assetExists } = require("../middlewares/asset-validator");
const { userExists } = require("../../../auth/middlewares/user-validator");

const router = Router();

// All routes need JWT verification
router.use(validateJWT);

// // GET events
router.get("/", getAssets);

// POST event
router.post(
  "/new",
  [
    check("title", "Title is required").not().isEmpty(),
    check("category", "Category is required").not().isEmpty(),
    check("description", "Description is required").not().isEmpty(),
    check("state", "State is required").not().isEmpty(),
    check("acquisitionDate", "Acquisition date is required").custom(isDate),
    fieldsValidator,
  ],
  createAsset
);

// PUT event
router.put(
  "/:id",
  [
    check("title", "Title is required").not().isEmpty(),
    check("category", "Category is required").not().isEmpty(),
    check("description", "Description is required").not().isEmpty(),
    check("state", "State is required").not().isEmpty(),
    check("acquisitionDate", "Acquisition date is required").custom(isDate),
    fieldsValidator,
    assetExists,
  ],
  updateAsset
);

// DELETE event
router.delete("/:id", assetExists, deleteAsset);

// PUT assign user to asset
router.put("/assign/:id", [assetExists, userExists], assignUserToAsset);

// GET PDF file
router.get("/pdf", downloadAssetFile);

module.exports = router;
