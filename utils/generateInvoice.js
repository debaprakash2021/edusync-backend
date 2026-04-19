import PDFDocument from "pdfkit";

export const generateInvoicePDF = (invoiceData) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];

    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    // Header
    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .text("EduSync", 50, 50);

    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#666666")
      .text("edusync.com  |  support@edusync.com", 50, 78);

    doc
      .moveTo(50, 100)
      .lineTo(550, 100)
      .strokeColor("#e0e0e0")
      .stroke();

    // Invoice title
    doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .fillColor("#000000")
      .text("Invoice", 50, 120);

    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#666666")
      .text(`Invoice No: ${invoiceData.invoiceNumber}`, 50, 148)
      .text(`Date: ${new Date(invoiceData.date).toLocaleDateString("en-IN")}`, 50, 164);

    // Bill to
    doc
      .fontSize(11)
      .font("Helvetica-Bold")
      .fillColor("#000000")
      .text("Billed To", 50, 210);

    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#333333")
      .text(invoiceData.studentName, 50, 228)
      .text(invoiceData.studentEmail, 50, 244);

    // Table header
    doc
      .rect(50, 290, 500, 30)
      .fillColor("#f5f5f5")
      .fill();

    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .fillColor("#000000")
      .text("Description", 60, 301)
      .text("Amount", 470, 301, { width: 70, align: "right" });

    // Table row
    doc
      .moveTo(50, 320)
      .lineTo(550, 320)
      .strokeColor("#e0e0e0")
      .stroke();

    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#333333")
      .text(invoiceData.courseName, 60, 335)
      .text(`INR ${invoiceData.amount.toLocaleString("en-IN")}`, 470, 335, {
        width: 70,
        align: "right",
      });

    doc
      .moveTo(50, 360)
      .lineTo(550, 360)
      .strokeColor("#e0e0e0")
      .stroke();

    // Total
    doc
      .fontSize(11)
      .font("Helvetica-Bold")
      .fillColor("#000000")
      .text("Total", 60, 378)
      .text(`INR ${invoiceData.amount.toLocaleString("en-IN")}`, 470, 378, {
        width: 70,
        align: "right",
      });

    // Footer
    doc
      .moveTo(50, 480)
      .lineTo(550, 480)
      .strokeColor("#e0e0e0")
      .stroke();

    doc
      .fontSize(9)
      .font("Helvetica")
      .fillColor("#999999")
      .text("Thank you for learning with EduSync.", 50, 494, {
        align: "center",
        width: 500,
      });

    doc.end();
  });
};