const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const Asset = require("../models/Asset");
const { structurePdf } = require("./structurePdf");

const generatePdf = async () => {
  const assets = await Asset.find();
  if (assets.length === 0) throw new Error("No assets found");

  const doc = new PDFDocument();
  const directoryPath = path.join(
    "D:",
    "Usuarios",
    "Carlos",
    "Proyecto_TFG",
    "zephyrm",
    "zephyrm-backend",
    "files"
  );
  const filePath = path.join(directoryPath, "assets_report.pdf");

  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    structurePdf(doc, assets);

    doc.end();

    writeStream.on("finish", () => {
      console.log("PDF generated successfully at path:", filePath);
      resolve(filePath);
    });

    writeStream.on("error", (err) => {
      console.error("Error writing PDF file:", err);
      reject(err);
    });
  });
};

module.exports = { generatePdf };
