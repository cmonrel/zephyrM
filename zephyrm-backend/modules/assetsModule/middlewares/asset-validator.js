const { response } = require("express");
const Asset = require("../models/Asset");

const assetAlreadyExists = async (req, res = response, next) => {
  const { title } = req.body;

  const asset = await Asset.findOne({ title });

  if (asset) {
    return res.status(400).json({
      ok: false,
      msg: "Asset already exists",
    });
  }

  next();
};

const assetExists = async (req, res = response, next) => {
  const assetId = req.params.id;

  const asset = await Asset.findById(assetId);

  if (!asset) {
    return res.status(404).json({
      ok: false,
      msg: "Asset not found",
    });
  }

  next();
};

module.exports = {
  assetAlreadyExists,
  assetExists,
};
