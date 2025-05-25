/**
 * Assets Controller
 *
 * Contains the controllers for asset management.
 *
 * @module modules/assetsModule/controllers/assets
 */

const { response } = require("express");

const Asset = require("../models/Asset");
const { generateFile } = require("../helpers/generateFile");

/**
 * Get all assets
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Promise<void>} - Sends a JSON response with the status and all the assets.
 *                            Responds with status 200 and the assets if successful.
 *                            If an error occurs, responds with status 500 and an error message.
 */
const getAssets = async (req, res = response) => {
  try {
    const assets = await Asset.find().populate("title", "category");

    res.status(200).json({
      ok: true,
      assets,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error getting assets",
    });
  }
};

/**
 * Creates a new asset in the database.
 *
 * @param {Object} req - The request object containing asset data in the body.
 * @param {Object} res - The response object used to send back the HTTP response.
 *
 * @returns {Promise<void>} - Sends a JSON response with the status and the created asset.
 *                            Responds with status 201 and the saved asset if successful.
 *                            If an error occurs, responds with status 400 and an error message.
 */

const createAsset = async (req, res = response) => {
  const asset = new Asset(req.body);

  try {
    const saveAsset = await asset.save();
    res.status(201).json({
      ok: true,
      saveAsset,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      msg: "Error creating asset",
    });
  }
};

/**
 * Updates an existing asset in the database with new data.
 *
 * @param {Object} req - The request object containing the asset ID in the URL
 *                       parameters and the new asset data in the request body.
 * @param {Object} res - The response object used to send back the HTTP response.
 *
 * @returns {Promise<void>} - Sends a JSON response with the status and the updated asset.
 *                            Responds with status 200 and the updated asset if successful.
 *                            If an error occurs, responds with status 400 and an error message.
 */

const updateAsset = async (req, res = response) => {
  const assetId = req.params.id;
  const newAsset = req.body;

  try {
    const updatedAsset = await Asset.findByIdAndUpdate(assetId, newAsset, {
      new: true,
    });

    res.status(200).json({
      ok: true,
      updatedAsset,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: "Error deleting asset",
    });
  }
};

/**
 * Deletes an asset from the database with the given ID.
 *
 * @param {Object} req - The request object containing the asset ID in the URL
 *                       parameters.
 * @param {Object} res - The response object used to send back the HTTP response.
 *
 * @returns {Promise<void>} - Sends a JSON response with the status.
 *                            Responds with status 200 if the asset is deleted successfully.
 *                            If an error occurs, responds with status 400 and an error message.
 */
const deleteAsset = async (req, res = response) => {
  const assetId = req.params.id;

  try {
    await Asset.findByIdAndDelete(assetId);

    res.status(200).json({
      ok: true,
      msg: "Asset deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: "Error deleting asset",
    });
  }
};

/**
 * Assigns a user to an existing asset in the database.
 *
 * @param {Object} req - The request object containing the asset ID in the URL
 *                       parameters and the user ID in the request body.
 * @param {Object} res - The response object used to send back the HTTP response.
 *
 * @returns {Promise<void>} - Sends a JSON response with the status and the updated asset.
 *                            Responds with status 200 and the updated asset if successful.
 *                            If an error occurs, responds with status 400 and an error message.
 */
const assignUserToAsset = async (req, res = response) => {
  const assetId = req.params.id;
  const { uid } = req.body;

  try {
    const { _doc } = await Asset.findById(assetId);
    const newAsset = {
      ..._doc,
      user: uid,
    };

    const updatedAsset = await Asset.findByIdAndUpdate(assetId, newAsset, {
      new: true,
    });

    res.status(200).json({
      ok: true,
      updatedAsset,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      msg: "Error assigning user to asset",
    });
  }
};

/**
 * Generates and sends an XLSX file containing asset data.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object used to send back the HTTP response.
 *
 * @returns {Promise<void>} - Sends a generated Excel file as a response.
 *                            If an error occurs, responds with status 500 and an error message.
 */

const downloadAssetFile = async (req, res = response) => {
  try {
    await generateFile(res);
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error generating Excel file",
      error: error.message,
    });
  }
};

module.exports = {
  assignUserToAsset,
  createAsset,
  deleteAsset,
  downloadAssetFile,
  getAssets,
  updateAsset,
};
