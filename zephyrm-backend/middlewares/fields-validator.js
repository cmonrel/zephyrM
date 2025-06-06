/**
 * Fields Validator Middleware
 *
 * Contains middleware functions for validating request fields.
 *
 * @module middlewares/fields-validator
 */

const { response } = require("express");
const { validationResult } = require("express-validator");

/**
 * Middleware to validate the fields of a request.
 *
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function in the stack.
 *
 * @returns {void} - Sends a JSON response with an error message if there are errors,
 * or calls the next middleware function if there are no errors.
 */
const fieldsValidator = (req, res = response, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errors.mapped(),
    });
  }

  next();
};

module.exports = {
  fieldsValidator,
};
