/* 
    Rutas de Usuarios /auth
    host + /api/auth
*/

const { Router } = require("express");

const { validateJWT } = require("../../middlewares/jwt-validator");
const {
  validatingUser,
  validBlocking,
} = require("../middlewares/user-validator");

const {
  loginUser,
  renewToken,
  blockUser,
  validateRoleUser,
} = require("../controllers/auth");

const router = Router();

// GET validate role
router.get("/role", validateRoleUser);

// POST login
router.post("/", validatingUser, loginUser);

// GET renew token
router.get("/renew", validateJWT, renewToken);

// POST block user
router.post("/block", validBlocking, blockUser);

module.exports = router;
