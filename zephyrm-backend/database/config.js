/**
 * Connection to MongoDB
 *
 * This module establishes a connection to the MongoDB database.
 *
 * @module database
 */

const mongoose = require("mongoose");

/**
 * Establishes a connection to the MongoDB database.
 *
 * @function dbConnection
 * @returns {Promise<void>}
 */
const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CN, {});
    console.log("DB Online");
  } catch (error) {
    console.log(error);
    throw new Error("Error starting database");
  }
};

module.exports = {
  dbConnection,
};
