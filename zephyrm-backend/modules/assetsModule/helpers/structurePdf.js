const structurePdf = (doc, assets) => {
  // Title
  doc.fontSize(20).text("Assets Report", { align: "center" });
  doc.moveDown(2);

  // Table header
  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("Title", { continued: true, width: 120, align: "left" })
    .text("Category", { continued: true, width: 120, align: "left" })
    .text("Description", { continued: true, width: 180, align: "left" })
    .text("Location", { continued: true, width: 120, align: "left" })
    .text("State", { align: "left" });

  doc.moveDown(0.5);
  doc.text(
    "----------------------------------------------------------------------------------------------------------------------------------------------------------------"
  );

  // Assets
  assets.forEach((asset) => {
    doc.fontSize(10).font("Helvetica");

    doc.text(asset.title, { continued: true, width: 120, align: "left" });
    doc.text(asset.category, { continued: true, width: 120, align: "left" });
    doc.text(asset.description || "N/A", {
      continued: true,
      width: 180,
      align: "left",
      lineGap: 2,
    });
    doc.text(asset.location || "N/A", {
      continued: true,
      width: 120,
      align: "left",
    });
    doc.text(asset.state || "N/A", { align: "left" });

    doc.moveDown(0.5);
  });

  return doc;
};

module.exports = { structurePdf };
