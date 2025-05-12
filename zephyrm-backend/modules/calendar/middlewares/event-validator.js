const { response } = require("express");
const Event = require("../models/Event");
const User = require("../../../auth/models/User");

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
