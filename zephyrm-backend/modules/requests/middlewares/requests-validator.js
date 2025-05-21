const { response } = require("express");
const Request = require("../models/Request");

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
