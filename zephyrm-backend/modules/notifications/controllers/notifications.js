const { response } = require("express");
const { agenda } = require("../../../agenda/agenda");
const Notification = require("../models/Notification");
const Event = require("../../calendar/models/Event");

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
