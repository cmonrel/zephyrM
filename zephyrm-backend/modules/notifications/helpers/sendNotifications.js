const Event = require("../../calendar/models/Event");
const Notification = require("../models/Notification");

module.exports = (agenda, io) => {
  agenda.define("sendNotification", async (job) => {
    const { user, event } = job.attrs.data;

    try {
      const eventFound = await Event.findById(event);
      const { title } = eventFound;

      const timeTillEvent = new Date(
        new Date(eventFound.start).getTime() - Date.now()
      );

      await Notification.create({
        user: user,
        title: "Event Reminder",
        description: `Your event "${title}" is starting in ${timeTillEvent.getMinutes()} minutes.`,
        eventDate: eventFound.start,
      });

      io.to(`user-${user}`).emit("notification", {
        title: "Event Reminder",
        message: `Your event "${title}" is starting in ${timeTillEvent.getMinutes()} minutes.`,
        eventFound,
      });
    } catch (error) {
      console.log(error);
    }
  });
};
