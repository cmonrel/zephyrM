const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const Asset = require("../models/Asset");
const { utc } = require("moment");
const User = require("../../../auth/models/User");

const generatePdf = async (res) => {
  try {
    const assets = await Asset.find();
    if (assets.length === 0) throw new Error("No assets found");

    const users = await User.find();
    if (users.length === 0) throw new Error("No users found");

    // Load the Excel template
    const directoryPath = path.join(
      "D:",
      "Usuarios",
      "Carlos",
      "Proyecto_TFG",
      "zephyrm",
      "zephyrm-backend",
      "files"
    );
    const filePath = path.join(directoryPath, "Template_Assets_Report.xlsx");

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.worksheets[0];

    if (!worksheet) throw new Error("No worksheets found in the template");

    // Map data to columms
    const columnMapping = {};
    const headerRow = worksheet.getRow(2);

    headerRow.eachCell((cell, colNumber) => {
      const headerValue = cell.value?.toString().toLowerCase().trim();
      if (headerValue) {
        columnMapping[colNumber] = headerValue;
      }
    });

    let rowIndex = 3;

    // Insert data
    assets.forEach((asset) => {
      const row = worksheet.getRow(rowIndex) || worksheet.addRow([]);
      Object.entries(columnMapping).forEach(([col, field]) => {
        const cell = row.getCell(parseInt(col));
        const existingStyle = { ...cell.style };

        if (field === "user") {
          if (asset[field]) {
            const uid = asset[field];
            const user = users.find(
              (user) => user._id.toString() === uid.toString()
            );
            cell.value = user.name;
          } else {
            cell.value = "Unassigned";
          }
        } else if (field === "acquisition date") {
          cell.value = asset.acquisitionDate;
        } else {
          cell.value = asset[field];
        }

        cell.style = existingStyle;
      });
      row.commit();
      rowIndex++;
    });

    // Auto-adjust column widths
    worksheet.columns.forEach((column) => {
      let maxLength = 10;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const cellLength = cell.value ? cell.value.toString().length : 0;
        if (cellLength > maxLength) {
          maxLength = cellLength + 5;
          if (cell._column._number === 5) {
            maxLength = 20;
          }
        }
      });
      column.width = maxLength;
    });

    // Save the updated Excel file
    const outputPath = path.join(directoryPath, "assets_report.xlsx");
    await workbook.xlsx.writeFile(outputPath);

    // Serve the file for download
    res.download(outputPath, "assets_report.xlsx");
    console.log("Report generated successfully");
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).send("Error generating report");
  }
};

module.exports = { generatePdf };
