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

module.exports = {
  assetExists,
};
