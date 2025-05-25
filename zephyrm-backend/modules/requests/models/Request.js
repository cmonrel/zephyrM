/**
 * Request model
 *
 * Defines the schema for the Request model.
 *
 * @module modules/requests/models/Request
 */

const { Schema, model } = require("mongoose");

const RequestSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  motivation: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  asset: {
    type: Schema.Types.ObjectId,
    ref: "Asset",
    required: true,
  },
  status: {
    type: String,
    default: "Pending",
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
});

RequestSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.rid = _id;
  return object;
});

module.exports = model("Request", RequestSchema);
