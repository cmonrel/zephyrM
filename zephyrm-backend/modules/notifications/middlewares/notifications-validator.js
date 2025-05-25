/**
 * Notifications Middlewares
 *
 * Contains middleware functions for notification validation.
 *
 * @module modules/notifications/middlewares/notifications-validator
 */

const { response } = require("express");

const Notification = require("../models/Notification");

/**
 * Middleware to check if a given user has notifications in the database.
 *
 * @param {Object} req - The request object containing the user ID in the URL
 *                       parameters.
 * @param {Object} res - The response object used to send back the HTTP response.
 * @param {Function} next - The next middleware function in the stack.
 *
 * @returns {Promise<void>} - Sends a 404 response with an error message if the
 *                            user does not have notifications.
 *                            Calls the next middleware if the user has
 *                            notifications.
 */
const userHaveNotifications = async (req, res = response, next) => {
  const user = req.params.id;
  const notifications = await Notification.find({ user });

  if (!notifications) {
    return res.status(404).json({
      ok: false,
      msg: "User does not have notifications",
    });
  }

  next();
};

module.exports = {
  userHaveNotifications,
};
