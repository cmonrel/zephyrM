/**
 * Requests Middlewares
 *
 * Contains middleware functions for request validation.
 *
 * @module modules/requests/middlewares/requests-validator
 */

const { response } = require("express");

const Request = require("../models/Request");

/**
 * Middleware to check if a given request belongs to the user making the request.
 *
 * @param {Object} req - The request object containing the request ID in the URL
 *                       parameters and the user ID in the request body.
 * @param {Object} res - The response object used to send back the HTTP response.
 * @param {Function} next - The next middleware function in the stack.
 *
 * @returns {Promise<void>} - Sends a 401 response with an error message if the
 *                            request does not belong to the user.
 *                            Calls the next middleware if the request belongs to
 *                            the user.
 */
const userRequest = async (req, res = response, next) => {
  const requestId = req.params.id;
  const uid = req.uid;

  try {
    const request = await Request.findById(requestId);

    if (request.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "You are not allowed to do this",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error validating user",
    });
  }
};

/**
 * Middleware to check if a request exists in the database.
 *
 * @param {Object} req - The request object containing the request ID in the URL parameters.
 * @param {Object} res - The response object used to send back the HTTP response.
 * @param {Function} next - The next middleware function in the stack.
 *
 * @returns {Promise<void>} - Sends a 404 response with an error message if the request does not exist.
 *                            Calls the next middleware if the request exists.
 */

const requestExist = async (req, res = response, next) => {
  const requestId = req.params.id;

  const request = await Request.findById(requestId);

  if (!request) {
    return res.status(404).json({
      ok: false,
      msg: "Request not found",
    });
  }

  next();
};

module.exports = { userRequest, requestExist };
