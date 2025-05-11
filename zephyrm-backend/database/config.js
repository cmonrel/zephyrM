const mongoose = require("mongoose");

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
