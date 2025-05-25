/**
 * Users Routes
 *
 * Sets up the routes for user management.
 * host + /api/users
 *
 * @module modules/users/routes/users
 */

const { Router } = require("express");
const { check } = require("express-validator");

const { validateJWT } = require("../../../middlewares/jwt-validator");
const {
  getUsers,
  createUser,
  updatePassword,
  updateUser,
  deleteUser,
} = require("../controllers/users");
const { fieldsValidator } = require("../../../middlewares/fields-validator");
const {
  userAlreadyExist,
  validRole,
} = require("../../../auth/middlewares/user-validator");

const router = Router();

// All routes after need JWT verification
router.use(validateJWT);

// GET users
router.get("/", getUsers);

// POST create user
router.post(
  "/new",
  [
    check("name", "Name is mandatory").not().isEmpty(),
    check("email", "Not an email").isEmail(),
    check("password", "Password can't be less than 6 characters").isLength({
      min: 6,
    }),
    fieldsValidator,
    userAlreadyExist,
    validRole,
  ],
  createUser
);

// UPDATE password
router.put(
  "/password/:id",
  [
    check("password", "Password can't be less than 6 characters").isLength({
      min: 6,
    }),
    fieldsValidator,
  ],
  updatePassword
);

// UPDATE user
router.put(
  "/:id",
  [
    check("name", "Name is mandatory").not().isEmpty(),
    check("email", "Not an email").isEmail(),
    fieldsValidator,
  ],
  updateUser
);

// DELETE users
router.delete("/:id", deleteUser);

module.exports = router;
