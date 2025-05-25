/**
 * isDate Helper
 *
 * Defines a function to check if a value is a valid date.
 *
 * @module helpers/isDate
 */

const moment = require("moment");
/**
 * Checks if the provided value is a valid date.
 *
 * @param {any} value - The value to be validated as a date.
 * @returns {boolean} - Returns true if the value is a valid date, false otherwise.
 */

const isDate = (value) => {
  if (!value) return false;

  const date = moment(value);
  if (date.isValid()) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  isDate,
};
