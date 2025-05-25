/**
 * JWT Validator Middleware
 *
 * Validates JSON Web Tokens (JWTs) in incoming requests.
 *
 * @module middlewares/jwt-validator
 */

const { response } = require("express");
const jwt = require("jsonwebtoken");

/**
 * Middleware to validate JSON Web Tokens (JWT) in incoming requests.
 *
 * It checks for the presence of a JWT in the request headers and verifies
 * its validity using a secret seed. If valid, it attaches the user's UID
 * and name to the request object. If invalid, it responds with an error.
 *
 * @param {Object} req - The request object, containing headers and other data.
 * @param {Object} res - The response object, used to send back the HTTP response.
 * @param {Function} next - The next middleware function in the stack.
 *
 * @returns {void} - Calls the next middleware function if the token is valid,
 * or sends a JSON response with an error message if the token is invalid or missing.
 */

const validateJWT = async (req, res = response, next) => {
  // x-token: headers
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "No token in request",
    });
  }

  try {
    const { uid, name } = jwt.verify(token, process.env.SECRET_JWT_SEED);
    req.uid = uid;
    req.name = name;
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Invalid token",
    });
  }

  next();
};

module.exports = {
  validateJWT,
};
