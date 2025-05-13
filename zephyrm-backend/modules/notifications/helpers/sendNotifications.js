const Notification = require("../models/Notification");

module.exports = (agenda, io) => {
  agenda.define("sendNotification", async (job) => {
    console.log("Sending notification...");
    const { userId, eventId } = job.attrs.data;
    console.log(userId);
    console.log(eventId);

    const event = await Event.findById(eventId);
    const { title } = event;
    console.log(title);

    await Notification.create({
      user: userId,
      title: "Event Reminder",
      description: `Your event "${title}" is starting in 30 minutes.`,
    });

    io.to(`user-${userId}`).emit("notification", {
      title: "Event Reminder",
      message: `Your event "${title}" is starting in 30 minutes.`,
      eventId,
    });
  });
};
