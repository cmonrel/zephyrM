const { Schema, model } = require("mongoose");

const EventSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  user: {
    type: Schema.Types.Object,
    ref: "User",
    required: true,
  },
  asset: {
    type: Schema.Types.Object,
    ref: "Asset",
  },
});

EventSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.eid = _id;
  return object;
});

module.exports = model("Event", EventSchema);
