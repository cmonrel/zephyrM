/**
 * Categories model
 *
 * Defines the schema for the Category model.
 *
 * @module modules/assetsModule/models/Categories
 */

const { Schema, model } = require("mongoose");

const CategorySchema = Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
});

CategorySchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.cid = _id;
  return object;
});

module.exports = model("Categories", CategorySchema);
