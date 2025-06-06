/**
 * Assets Middlewares
 *
 * Contains middleware functions for asset validation.
 *
 * @module modules/assetsModule/middlewares/asset-validator
 */

const { response } = require("express");
const Asset = require("../models/Asset");

/**
 * Middleware to validate if an asset exists in the database
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Function} next Next function in the middleware chain
 */
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

/**
 * Middleware to check if an NFC is unique before creating a new asset
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Function} next Next function in the middleware chain
 */
const NFCUnique = async (req, res = response, next) => {
  if (req.body.nfcTag === "") return next();

  const asset = await Asset.findOne({ nfcTag: req.body.nfcTag });

  if (asset) {
    return res.status(400).json({
      ok: false,
      msg: "NFC already in use",
    });
  }

  next();
};

module.exports = {
  assetExists,
  NFCUnique,
};
