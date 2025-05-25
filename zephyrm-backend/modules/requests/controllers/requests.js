/**
 * Requests Controller
 *
 * Contains the controllers for request management.
 *
 * @module modules/requests/controllers/requests
 */

const Request = require("../models/Request");

/**
 * Retrieves all requests from the database and sends them back to the client in a JSON response.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object used to send back the HTTP response.
 *
 * @returns {Promise<void>} - Sends a JSON response with the status and all the requests.
 *                            Responds with status 200 and the requests if successful.
 *                            If an error occurs, responds with status 500 and an error message.
 */
const getRequests = async (req, res = response) => {
  try {
    const requests = await Request.find().sort({ creationDate: -1 });

    res.status(200).json({
      ok: true,
      requests,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error getting requests",
    });
  }
};

/**
 * Creates a new request in the database.
 *
 * @param {Object} req - The request object containing request data in the body.
 * @param {Object} res - The response object used to send back the HTTP response.
 *
 * @returns {Promise<void>} - Sends a JSON response with the status and the created request.
 *                            Responds with status 201 and the saved request if successful.
 *                            If an error occurs, responds with status 500 and an error message.
 */

const createRequest = async (req, res = response) => {
  try {
    const request = new Request(req.body);
    const savedRequest = await request.save();

    res.status(201).json({
      ok: true,
      savedRequest,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error creating request",
    });
  }
};

/**
 * Deletes a request from the database with the given ID.
 *
 * @param {Object} req - The request object containing the request ID in the URL
 *                       parameters.
 * @param {Object} res - The response object used to send back the HTTP response.
 *
 * @returns {Promise<void>} - Sends a JSON response with the status.
 *                            Responds with status 200 and a success message if the request is
 *                            deleted successfully.
 *                            If an error occurs, responds with status 500 and an error message.
 */

const deleteRequest = async (req, res = response) => {
  const requestId = req.params.id;

  try {
    await Request.findByIdAndDelete(requestId);

    res.status(200).json({
      ok: true,
      msg: "Request deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error deleting request",
    });
  }
};

/**
 * Updates the status of a request in the database.
 *
 * @param {Object} req - The request object containing the request ID in the URL
 *                       parameters and the new status in the request body.
 * @param {Object} res - The response object used to send back the HTTP response.
 *
 * @returns {Promise<void>} - Sends a JSON response with the status and the updated request.
 *                            Responds with status 200 and a success message if the request is
 *                            updated successfully.
 *                            If an error occurs, an error message is logged.
 */

const markRequestStatus = async (req, res = response) => {
  const requestId = req.params.id;
  const { status } = req.body;

  try {
    const { _doc: request } = await Request.findById(requestId);
    const updateRequest = {
      ...request,
      status: status,
    };

    await Request.findByIdAndUpdate(requestId, updateRequest, {
      new: true,
    });

    res.status(200).json({
      ok: true,
      msg: "Request updated successfully",
    });
  } catch (error) {}
};

module.exports = {
  createRequest,
  deleteRequest,
  markRequestStatus,
  getRequests,
};
