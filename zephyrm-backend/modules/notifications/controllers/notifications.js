/**
 * Notifications Controller
 *
 * Contains the controllers for notification management.
 *
 * @module modules/notifications/controllers/notifications
 */

const { response } = require("express");
const { agenda } = require("../../../agenda/agenda");
const Notification = require("../models/Notification");
const Event = require("../../calendar/models/Event");

/**
 * Retrieves the notifications for a given user.
 *
 * @param {Object} req - The request object containing the user ID in the URL
 *                        parameters.
 * @param {Object} res - The response object used to send back the HTTP response.
 *
 * @returns {Promise<void>} - Sends a JSON response with the status and the
 *                            notifications for the given user if successful.
 *                            If an error occurs, sends a JSON response with
 *                            status 500 and an error message.
 */
const getNotifications = async (req, res = response) => {
  const user = req.params.id;
  try {
    const notifications = await Notification.find({ user }).sort({
      creationDate: -1,
    });
    res.status(200).json({
      ok: true,
      notifications,
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
 * Creates a new notification in the database.
 *
 * @param {Object} req - The request object containing the notification data in the
 *                       request body.
 * @param {Object} res - The response object used to send back the HTTP response.
 *
 * @returns {Promise<void>} - Sends a JSON response with the status and the
 *                            created notification if successful.
 *                            If an error occurs, sends a JSON response with
 *                            status 500 and an error message.
 */
const createNotification = async (req, res = response) => {
  try {
    const notification = new Notification(req.body);
    const savedNotification = await notification.save();

    res.status(201).json({
      ok: true,
      savedNotification,
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
 * Deletes a notification from the database with the given ID.
 *
 * @param {Object} req - The request object containing the notification ID in the
 *                       URL parameters.
 * @param {Object} res - The response object used to send back the HTTP response.
 *
 * @returns {Promise<void>} - Sends a JSON response with the status.
 *                            Responds with status 200 and a success message if the notification is
 *                            deleted successfully.
 *                            If an error occurs, responds with status 500 and an
 *                            error message.
 */
const deleteNotification = async (req, res = response) => {
  const notificationId = req.params.id;
  try {
    await Notification.findByIdAndDelete(notificationId);

    res.status(200).json({
      ok: true,
      msg: "Notification deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Please contact admins",
    });
  }
};

/**
 * Marks a specific notification as read by updating its data in the database.
 *
 * @param {Object} req - The request object containing the notification ID in the URL
 *                       parameters and the updated notification data in the request body.
 * @param {Object} res - The response object used to send back the HTTP response.
 *
 * @returns {Promise<void>} - Sends a JSON response with the status and the updated notification.
 *                            Responds with status 200 and the updated notification if successful.
 *                            If an error occurs, responds with status 500 and an error message.
 */

const markAsRead = async (req, res = response) => {
  const notificationId = req.params.id;
  const newNotification = req.body;

  try {
    const notificationUpdated = await Notification.findByIdAndUpdate(
      notificationId,
      newNotification,
      { new: true }
    );

    res.status(200).json({
      ok: true,
      notificationUpdated,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Please contact admins",
    });
  }
};

/**
 * Marks all the notifications in the given list as read by updating their data in the database.
 *
 * @param {Object} req - The request object containing the list of notifications to mark as read in the request body.
 * @param {Object} res - The response object used to send back the HTTP response.
 *
 * @returns {Promise<void>} - Sends a JSON response with the status.
 *                            Responds with status 200 and a success message if the notifications are
 *                            marked as read successfully.
 *                            If an error occurs, responds with status 500 and an error message.
 */
const markAllAsRead = (req, res = response) => {
  const notifications = req.body;
  try {
    notifications.forEach(async (notification) => {
      await Notification.findByIdAndUpdate(notification.nid, notification, {
        new: true,
      });
    });

    res.status(200).json({
      ok: true,
      msg: "Notifications marked as read successfully",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Please contact admins",
    });
  }
};

/**
 * Schedules a notification to be sent to the given user about the given event at
 * 30 minutes before the event starts.
 *
 * @param {Object} req - The request object containing the user ID and event ID in
 *                       the request body.
 * @param {Object} res - The response object used to send back the HTTP response.
 *
 * @returns {Promise<void>} - Sends a JSON response with the status.
 *                            Responds with status 201 and a success message if the notification is
 *                            scheduled successfully.
 *                            If an error occurs, responds with status 500 and an error message.
 */
const scheduleNotification = async (req, res = response) => {
  const { user, event } = req.body;

  const eventFound = await Event.findById(event);

  const { title, description, start } = eventFound;

  const notifyTime = new Date(new Date(start).getTime() - 30 * 60 * 1000);

  await agenda.schedule(notifyTime, "sendNotification", {
    user,
    event,
    title,
    description,
  });

  res.status(201).json({
    ok: true,
    msg: "Notification scheduled successfully",
  });
};

module.exports = {
  createNotification,
  deleteNotification,
  getNotifications,
  markAllAsRead,
  markAsRead,
  scheduleNotification,
};
