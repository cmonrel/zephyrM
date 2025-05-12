const { response } = require("express");
const Notification = require("../models/Notification");

const notificationStreams = new Map();

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
    const saveNotification = await notification.save();
    res.status(201).json({
      ok: true,
      saveNotification,
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

const setupNotificationStream = (req, res) => {
  console.log(res);
  const uid = req.params.id;

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  notificationStreams.set(uid, res);

  Notification.find({ user: uid })
    .sort({ creationDate: -1 })
    .limit(10)
    .then((notifications) => {
      res.write(
        `data: ${JSON.stringify({
          type: "INITIAL_DATA",
          notifications,
        })}\n\n`
      );
    });

  req.on("close", () => {
    notificationStreams.delete(uid);
  });
};

module.exports = {
  createNotification,
  deleteNotification,
  getNotifications,
  markAllAsRead,
  markAsRead,
  setupNotificationStream,
};
