const { response } = require("express");
const Notification = require("../models/Notification");

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
  console.log(notificationId);
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
  const { userId, title, startTime } = req.body;

  const event = await Event.create({ user: userId, title, startTime });

  const notifyTime = new Date(new Date(startTime).getTime() - 30 * 60 * 1000);

  await agenda.schedule(notifyTime, "sendNotification", {
    userId,
    eventId: event._id,
    title,
  });

  res.status(201).json({
    ok: true,
    event,
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
