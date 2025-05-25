/**
 * Events Middlewares
 *
 * Contains middleware functions for event validation.
 *
 * @module modules/calendar/middlewares/event-validator
 */

const { response } = require("express");

const Event = require("../models/Event");
const User = require("../../../auth/models/User");

/**
 * Middleware to check if an event exists in the database.
 *
 * @param {Object} req - The request object containing the event ID in the URL parameters.
 * @param {Object} res - The response object used to send back the HTTP response.
 * @param {Function} next - The next middleware function in the stack.
 *
 * @returns {Promise<void>} - Sends a 404 response with an error message if the event does not exist.
 *                            Calls the next middleware if the event exists.
 */

const eventExist = async (req, res = response, next) => {
  const eventId = req.params.id;

  const event = await Event.findById(eventId);

  if (!event) {
    return res.status(404).json({
      ok: false,
      msg: "Event not found",
    });
  }

  next();
};

/**
 * Middleware to check if a given event belongs to the user making the request
 * or if the user is an admin.
 *
 * @param {Object} req - The request object containing the event ID in the URL
 *                       parameters and the user ID in the request body.
 * @param {Object} res - The response object used to send back the HTTP response.
 * @param {Function} next - The next middleware function in the stack.
 *
 * @returns {Promise<void>} - Sends a 401 response with an error message if the
 *                            event does not belong to the user and the user is
 *                            not an admin.
 *                            Calls the next middleware if the event belongs to
 *                            the user or the user is an admin.
 */
const isUserEvent = async (req, res = response, next) => {
  const eventId = req.params.id;
  const uid = req.uid;

  const user = await User.findById(uid);

  const event = await Event.findById(eventId);
  if (event.user.uid !== uid && user.role !== "admin") {
    return res.status(401).json({
      ok: false,
      msg: "You are not allowed to do this",
    });
  }

  next();
};

module.exports = {
  eventExist,
  isUserEvent,
};
