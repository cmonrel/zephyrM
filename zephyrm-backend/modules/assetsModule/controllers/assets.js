const { response } = require("express");
const fs = require("fs");

const Asset = require("../models/Asset");
const { generatePdf } = require("../helpers/generatePDF");

// GET assets
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

// POST asset
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

// PUT asset
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

// DELETE asset
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

// POST assign user to asset
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

const downloadAssetPdf = async (req, res = response) => {
  try {
    const pdfPath = await generatePdf();

    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ ok: false, msg: "Error generating PDF" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="assets_report.pdf"'
    );

    const fileStream = fs.createReadStream(pdfPath);
    fileStream.pipe(res);
    // res.download(pdfPath, (err) => {
    //   if (err) {
    //     console.error("Error sending file:", err);
    //   }

    //   fs.unlinkSync(pdfPath);
    // });

    fileStream.on("end", () => {
      fs.unlink(pdfPath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        }
      });
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error generating PDF",
      error: error.message,
    });
  }
};

module.exports = {
  assignUserToAsset,
  createAsset,
  deleteAsset,
  downloadAssetPdf,
  getAssets,
  updateAsset,
};
