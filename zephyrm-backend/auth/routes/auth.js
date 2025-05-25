/**
 * Auth Routes
 *
 * Sets up the routes for user authentication.
 * host + /api/auth
 *
 * @module auth/routes/auth
 */

const { Router } = require("express");

const { validateJWT } = require("../../middlewares/jwt-validator");
const {
  validatingUser,
  validBlocking,
} = require("../middlewares/user-validator");

const { loginUser, renewToken, blockUser } = require("../controllers/auth");

const router = Router();

// POST login
router.post("/", validatingUser, loginUser);

// GET renew token
router.get("/renew", validateJWT, renewToken);

// POST block user
router.post("/block", validBlocking, blockUser);

module.exports = router;
