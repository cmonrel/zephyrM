/**
 * Assets Routes
 *
 * Sets up the routes for asset management.
 * host + /api/assets
 *
 * @module modules/assetsModule/routes/assets
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
const { assetExists, NFCUnique } = require("../middlewares/asset-validator");
const { userExists } = require("../../../auth/middlewares/user-validator");

const router = Router();

// All routes need JWT verification
router.use(validateJWT);

// GET assets
router.get("/", getAssets);

// POST asset
router.post(
  "/new",
  [
    check("title", "Title is required").not().isEmpty(),
    check("category", "Category is required").not().isEmpty(),
    check("description", "Description is required").not().isEmpty(),
    check("state", "State is required").not().isEmpty(),
    check("acquisitionDate", "Acquisition date is required").custom(isDate),
    fieldsValidator,
    NFCUnique,
  ],
  createAsset
);

// PUT asset
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
    NFCUnique,
  ],
  updateAsset
);

// DELETE asset
router.delete("/:id", assetExists, deleteAsset);

// PUT remove nfc
router.put("/remove-nfc/:id", [assetExists], updateAsset);

// PUT assign user to asset
router.put("/assign/:id", [assetExists], assignUserToAsset);

// GET XLSX file
router.get("/xlsx", downloadAssetFile);

module.exports = router;
