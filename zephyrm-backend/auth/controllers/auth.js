/**
 * Auth Controller
 *
 * Contains the controllers for user authentication.
 *
 * @module auth/controllers/auth
 */

const { response } = require("express");

const User = require("../models/User");
const { generateJWT } = require("../../helpers/jwt");

/**
 * Authenticates a user by email, resets the login attempt counter,
 * and generates a JWT token upon successful login.
 *
 * @param {Object} req - The request object, containing the user email in the body.
 * @param {Object} res - The response object, used to send back the HTTP response.
 *
 * @returns {void} - Sends a JSON response with the user details and JWT token if successful,
 * or an error message if the login process fails.
 */

const loginUser = async (req, res = response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: new RegExp(`^${email}$`, "i") });
    user.counter = 0;

    // Save user
    await user.save();

    // Generate JWT
    const token = await generateJWT(user.id, user.name);

    res.status(202).json({
      ok: true,
      uid: user.id,
      name: user.name,
      role: user.role,
      counter: user.counter,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Please contact admins",
    });
  }
};

/**
 * Generates a new JWT token for the user in the request, given
 * they have a valid token to begin with.
 *
 * @param {Object} req - The request object, containing the user id and name
 * in the request.
 * @param {Object} res - The response object, used to send back the HTTP response.
 *
 * @returns {void} - Sends a JSON response with the user details and new JWT token if successful,
 * or an error message if the token renewal process fails.
 */
const renewToken = async (req, res = response) => {
  const { uid, name } = req;

  try {
    const { role } = await User.findById(uid);

    // Generate JWT
    const token = await generateJWT(uid, name);

    res.status(200).json({
      ok: true,
      uid,
      name,
      role,
      token,
    });
  } catch (error) {}
};

/**
 * Blocks a user by their email, resetting their login attempt counter,
 * and updating their status to blocked in the database.
 *
 * @param {Object} req - The request object, containing the user email in the body.
 * @param {Object} res - The response object, used to send back the HTTP response.
 *
 * @returns {void} - Sends a JSON response with the user details and success message if successful,
 * or an error message if the blocking process fails.
 */

const blockUser = async (req, res = response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    user.blocked = true;
    user.counter = 0;

    // Save user
    await user.save();

    res.status(200).json({
      ok: true,
      user,
      msg: "user blocked successfully",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error blocking user",
    });
  }
};

module.exports = {
  loginUser,
  renewToken,
  blockUser,
};
