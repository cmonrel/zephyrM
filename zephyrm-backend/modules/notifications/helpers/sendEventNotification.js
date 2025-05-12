const sendEventNotification = async (uid, event) => {
  const notification = await Notification.create({
    user: uid,
    type: "event-reminder",
    message: `Event "${event.title}" starting soon`,
    relatedEvent: event.eid,
    read: false,
  });

  const clientRes = notificationStreams.get(uid.toString());
  if (clientRes) {
    clientRes.write(
      `data: ${JSON.stringify({
        type: "NEW_NOTIFICATION",
        notification,
      })}\n\n`
    );
  }

  return notification;
};

module.exports = sendEventNotification;
