/**
 * Events Controller
 *
 * Contains the controllers for events management.
 *
 * @module modules/calendar/controllers/events
 */

const { response } = require("express");
const Event = require("../models/Event");

/**
 * Retrieves all events from the database and sends them back to the client in a JSON response.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object used to send back the HTTP response.
 *
 * @returns {Promise<void>} - Sends a JSON response with the status and all the events.
 *                            Responds with status 200 and the events if successful.
 *                            If an error occurs, responds with status 500 and an error message.
 */
const getEvents = async (req, res = response) => {
  try {
    const events = await Event.find().populate("title");

    res.status(200).json({
      ok: true,
      events,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error getting events",
    });
  }
};

/**
 * Creates a new event in the database.
 *
 * @param {Object} req - The request object containing event data in the body.
 * @param {Object} res - The response object used to send back the HTTP response.
 *
 * @returns {Promise<void>} - Sends a JSON response with the status and the created event.
 *                            Responds with status 201 and the saved event if successful.
 *                            If an error occurs, responds with status 500 and an error message.
 */
const createEvent = async (req, res = response) => {
  const event = new Event(req.body);
  try {
    const saveEvent = await event.save();

    res.status(201).json({
      ok: true,
      saveEvent,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Please contact admins",
    });
  }
};

/**
 * Updates an existing event in the database with new data.
 *
 * @param {Object} req - The request object containing the event ID in the URL
 *                       parameters and the new event data in the request body.
 * @param {Object} res - The response object used to send back the HTTP response.
 *
 * @returns {Promise<void>} - Sends a JSON response with the status and the updated event.
 *                            Responds with status 200 and the updated event if successful.
 *                            If an error occurs, responds with status 500 and an error message.
 */
const updateEvent = async (req, res = response) => {
  const eventId = req.params.id;
  const newEvent = req.body;

  try {
    const updatedEvent = await Event.findByIdAndUpdate(eventId, newEvent, {
      new: true,
    });

    res.json({
      ok: true,
      updatedEvent,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Please contact admins",
    });
  }
};

/**
 * Deletes an event from the database with the given ID.
 *
 * @param {Object} req - The request object containing the event ID in the URL
 *                       parameters.
 * @param {Object} res - The response object used to send back the HTTP response.
 *
 * @returns {Promise<void>} - Sends a JSON response with the status.
 *                            Responds with status 200 if the event is deleted successfully.
 *                            If an error occurs, responds with status 500 and an error message.
 */
const deleteEvent = async (req, res = response) => {
  const eventId = req.params.id;

  try {
    const deletedEvent = await Event.findByIdAndDelete(eventId);

    res.json({
      ok: true,
      deletedEvent,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Please contact admins",
    });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
