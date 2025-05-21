const { Schema, model } = require("mongoose");

const NotificationSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Schema.Types.Object,
    ref: "User",
    required: true,
  },
  event: {
    type: Schema.Types.Object,
    ref: "Event",
  },
  asset: {
    type: Schema.Types.Object,
    ref: "Asset",
  },
  eventDate: {
    type: Date,
    default: Date.now(),
  },
  creationDate: {
    type: Date,
    default: Date.now(),
  },
});

NotificationSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.nid = _id;
  return object;
});

module.exports = model("Notification", NotificationSchema);
