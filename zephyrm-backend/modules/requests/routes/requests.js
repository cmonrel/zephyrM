/**
 * Requests Routes
 *
 * Sets up the routes for request management.
 * host + /api/requests
 *
 * @module modules/requests/routes/requests
 */

const { Router } = require("express");
const { check } = require("express-validator");

const {
  deleteRequest,
  getRequests,
  markRequestStatus,
  createRequest,
} = require("../controllers/requests");
const { validateJWT } = require("../../../middlewares/jwt-validator");
const {
  userRequest,
  requestExist,
} = require("../middlewares/requests-validator");
const { fieldsValidator } = require("../../../middlewares/fields-validator");

const router = Router();

// All routes need JWT verification
router.use(validateJWT);

// // GET request
router.get("/", getRequests);

// POST request
router.post(
  "/new",
  [
    check("title", "Title is required").not().isEmpty(),
    check("motivation", "Motivation is required").not().isEmpty(),
    check("user", "User is required").not().isEmpty(),
    check("asset", "Asset is required").not().isEmpty(),
    fieldsValidator,
  ],
  createRequest
);

// PUT request
router.put("/:id", requestExist, markRequestStatus);

// DELETE request
router.delete("/:id", userRequest, deleteRequest);

module.exports = router;
