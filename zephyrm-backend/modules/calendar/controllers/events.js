const { response } = require("express");
const Event = require("../models/Event");
const sendEventNotification = require("../../notifications/helpers/sendEventNotification");

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
const createEvent = async (req, res = response) => {
  const event = new Event(req.body);
  try {
    const saveEvent = await event.save();

    const notifyTime = new Date(event.start) - 30 * 60 * 1000; // 30 mins before
    if (notifyTime > Date.now()) {
      setTimeout(async () => {
        await sendEventNotification(event.user.uid, event);
      }, notifyTime - Date.now());
    }

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
