/**
 * Users Controller
 *
 * Contains the controllers for user management.
 *
 * @module modules/users/controllers/users
 */

const { response } = require("express");
const bcrypt = require("bcryptjs");

const User = require("../../../auth/models/User");
const { generateJWT } = require("../../../helpers/jwt");

/**
 * Retrieves the list of users in the database.
 *
 * @param {Object} req - The request object containing the user ID in the URL
 *                        parameters.
 * @param {Object} res - The response object used to send back the HTTP response.
 *
 * @returns {Promise<void>} - Sends a JSON response with the status and the
 *                            list of users if successful.
 *                            If an error occurs, sends a JSON response with
 *                            status 500 and an error message.
 */

const getUsers = async (req, res = response) => {
  try {
    const users = await User.find().populate("name", "email");
    const usersMapped = users.map((user) => {
      return {
        uid: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      };
    });
    res.status(200).json({
      ok: true,
      usersMapped,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error getting users",
    });
  }
};

/**
 * Creates a new user in the database.
 *
 * @param {Object} req - The request object containing the user data in the request body.
 * @param {Object} res - The response object used to send back the HTTP response.
 *
 * @returns {Promise<void>} - Sends a JSON response with the status and the
 *                            created user if successful.
 *                            If an error occurs, sends a JSON response with
 *                            status 500 and an error message.
 */
const createUser = async (req, res = response) => {
  const { password } = req.body;

  try {
    const user = new User(req.body);
    user.blocked = false;
    user.counter = 0;

    // Encrypt password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    // Save user
    await user.save();

    // Generate JWT
    const token = await generateJWT(user.id, user.name);

    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
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
 * Updates the password for the user with the given ID.
 *
 * @param {Object} req - The request object containing the user ID in the URL
 *                       parameters and the new password in the request body.
 * @param {Object} res - The response object used to send back the HTTP response.
 *
 * @returns {Promise<void>} - Sends a JSON response with the status and the
 *                            updated user if successful.
 *                            If an error occurs, sends a JSON response with
 *                            status 500 and an error message.
 */
const updatePassword = async (req, res = response) => {
  const { password } = req.body;
  const uid = req.params.id;

  try {
    const user = await User.findById({ _id: uid });
    user.password = password;

    // Encrypt password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    // Save user
    await user.save();

    res.status(200).json({
      ok: true,
      uid: user.id,
      name: user.name,
      role: user.role,
      email: user.email,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error updating password",
    });
  }
};

/**
 * Updates an existing user in the database with new data.
 *
 * @param {Object} req - The request object containing the user ID in the URL
 *                       parameters and the new user data in the request body.
 * @param {Object} res - The response object used to send back the HTTP response.
 *
 * @returns {Promise<void>} - Sends a JSON response with the status and the
 *                            updated user if successful.
 *                            If an error occurs, sends a JSON response with
 *                            status 500 and an error message.
 */
const updateUser = async (req, res = response) => {
  const uid = req.params.id;
  const user = req.body;

  try {
    await User.findByIdAndUpdate({ _id: uid }, req.body);

    res.status(200).json({
      ok: true,
      uid: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error updating user",
    });
  }
};

/**
 * Deletes an existing user from the database with the given ID.
 *
 * @param {Object} req - The request object containing the user ID in the URL
 *                       parameters.
 * @param {Object} res - The response object used to send back the HTTP response.
 *
 * @returns {Promise<void>} - Sends a JSON response with the status.
 *                            Responds with status 200 if the user is deleted
 *                            successfully.
 *                            If an error occurs, responds with status 500 and
 *                            an error message.
 */
const deleteUser = async (req, res = response) => {
  const uid = req.params.id;
  try {
    await User.findByIdAndDelete({ _id: uid });
    res.status(200).json({
      ok: true,
      msg: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error deleting user",
    });
  }
};

module.exports = {
  getUsers,
  createUser,
  updatePassword,
  updateUser,
  deleteUser,
};
