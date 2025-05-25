/**
 * User Middlewares
 *
 * Contains middleware functions for user validation.
 *
 * @module auth/middlewares/user-validator
 */

const { response } = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

/**
 * Middleware to check if a user with the provided email already exists.
 *
 * @param {Object} req - The request object, containing the email in the body.
 * @param {Object} res - The response object for sending HTTP responses.
 * @param {Function} next - The next middleware function in the stack.
 *
 * @returns {void} - Sends a JSON response with an error message if the user exists,
 * or calls the next middleware function if the user does not exist.
 */

const userAlreadyExist = async ({ body }, res = response, next) => {
  const { email } = body;

  const user = await User.findOne({ email: new RegExp(`^${email}$`, "i") });

  if (user) {
    return res.status(400).json({
      ok: false,
      msg: "User already exists",
    });
  }

  next();
};

/**
 * Middleware to validate the user login credentials.
 *
 * @param {Object} req - The request object, containing the email and password in the body.
 * @param {Object} res - The response object for sending HTTP responses.
 * @param {Function} next - The next middleware function in the stack.
 *
 * @returns {void} - Sends a JSON response with an error message if the user or password is incorrect,
 * or if the user is blocked, or calls the next middleware function if the user is valid.
 */
const validatingUser = async (req, res = response, next) => {
  const { email, password } = req.body;

  if (email.length === 0 || password.length === 0) {
    return res.status(400).json({
      ok: false,
      msg: "Password and email are required",
    });
  }

  const user = await User.findOne({ email: new RegExp(`^${email}$`, "i") });

  if (!user) {
    return res.status(400).json({
      ok: false,
      msg: "User or password are incorrect",
    });
  }

  const { blocked } = user;

  if (blocked) {
    return res.status(400).json({
      ok: false,
      msg: "User is blocked, please contact admins",
    });
  }

  const validPassword = bcrypt.compareSync(password, user.password);

  if (!validPassword) {
    user.counter += 1;
    await user.save();

    return res.status(400).json({
      ok: false,
      counter: user.counter,
      msg: "Email or password are incorrect",
    });
  }

  next();
};

/**
 * Middleware to check if a user with the provided email can be blocked.
 *
 * @param {Object} req - The request object, containing the email in the body.
 * @param {Object} res - The response object, used to send back the HTTP response.
 * @param {Function} next - The next middleware function in the stack.
 *
 * @returns {void} - Calls the next middleware function if the user can be blocked,
 * or sends a JSON response with an error message if the user can't be blocked.
 */
const validBlocking = async ({ body }, res = response, next) => {
  const { email } = body;

  const user = await User.findOne({ email: new RegExp(`^${email}$`, "i") });

  if (!user) {
    return res.status(400).json({
      ok: false,
      msg: "User not found",
    });
  }

  const { counter, blocked } = user;

  if (blocked) {
    return res.status(400).json({
      ok: false,
      msg: "User is already blocked",
    });
  }

  if (counter < 5) {
    return res.status(400).json({
      ok: false,
      msg: "User can't be blocked",
    });
  }

  next();
};

/**
 * Middleware to validate the user's role.
 *
 * @param {Object} req - The request object, containing the role in the body.
 * @param {Object} res - The response object for sending HTTP responses.
 * @param {Function} next - The next middleware function in the stack.
 *
 * @returns {void} - Calls the next middleware function if the role is valid,
 * or sends a JSON response with an error message if the role is invalid.
 */

const validRole = (req, res = response, next) => {
  const { role } = req.body;

  if (role !== "admin" && role !== "worker") {
    return res.status(400).json({
      ok: false,
      msg: "Role not valid",
    });
  }
  next();
};

module.exports = {
  userAlreadyExist,
  validBlocking,
  validatingUser,
  validRole,
};
