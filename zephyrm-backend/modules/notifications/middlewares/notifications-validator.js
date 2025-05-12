const { response } = require("express");
const Notification = require("../models/Notification");

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
