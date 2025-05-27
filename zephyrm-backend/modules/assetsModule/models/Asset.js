/**
 * Asset model
 *
 * Defines the schema for the Asset model.
 *
 * @module modules/assetsModule/models/Asset
 */

const { Schema, model } = require("mongoose");

const AssetSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  acquisitionDate: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
  },
  state: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  NFCTag: {
    type: String,
  },
});

AssetSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.aid = _id;
  return object;
});

module.exports = model("Asset", AssetSchema);
