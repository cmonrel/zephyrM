const Request = require("../models/Request");

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

const markRequestStatus = async (req, res = response) => {
  const requestId = req.params.id;
  const { status } = req.body;

  try {
    const { _doc: request } = await Request.findById(requestId);
    const updateRequest = {
      ...request,
      status: status,
    };

    const resp = await Request.findByIdAndUpdate(requestId, updateRequest, {
      new: true,
    });

    res.status(200).json({
      ok: true,
      msg: "Request updated successfully",
      resp,
    });
  } catch (error) {}
};

module.exports = {
  createRequest,
  deleteRequest,
  markRequestStatus,
  getRequests,
};
