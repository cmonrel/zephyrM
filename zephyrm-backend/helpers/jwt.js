/**
 * JWT Generator
 *
 * Defines a function to generate a JSON Web Token (JWT), valid for 2 hours, for a user.
 *
 * @module helpers/jwt
 */

const jwt = require("jsonwebtoken");

/**
 * Generates a JSON Web Token (JWT) for the user with the given uid and name.
 *
 * The token is signed with the secret key in the environment variable
 * SECRET_JWT_SEED and is valid for 2 hours.
 *
 * @param {string} uid - The UID of the user to generate the token for.
 * @param {string} name - The name of the user to generate the token for.
 *
 * @returns {Promise<string>} A promise that resolves with the generated JWT
 * token or rejects with an error message if the token could not be generated.
 */
const generateJWT = (uid, name) => {
  return new Promise((resolve, reject) => {
    const payload = { uid, name };
    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED,
      {
        expiresIn: "2h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("No se pudo generar el token");
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = {
  generateJWT,
};
