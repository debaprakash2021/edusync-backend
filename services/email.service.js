import transporter from "../config/email.js";

export const sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"EduSync" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Your EduSync OTP",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2>Verify your email</h2>
        <p>Your one-time password is:</p>
        <h1 style="letter-spacing:8px;color:#534AB7">${otp}</h1>
        <p>This OTP expires in <strong>5 minutes</strong>. Do not share it with anyone.</p>
      </div>
    `,
  });
};

export const sendPasswordResetEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"EduSync" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Reset your EduSync password",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2>Password Reset</h2>
        <p>Use this OTP to reset your password:</p>
        <h1 style="letter-spacing:8px;color:#534AB7">${otp}</h1>
        <p>Expires in <strong>5 minutes</strong>. Ignore if you didn't request this.</p>
      </div>
    `,
  });
};

export const sendInvoiceEmail = async (email, studentName, courseName, pdfBuffer, invoiceNumber) => {
  await transporter.sendMail({
    from: `"EduSync" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Your EduSync Invoice - ${invoiceNumber}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2>Thank you for your purchase!</h2>
        <p>Hi <strong>${studentName}</strong>,</p>
        <p>You are now enrolled in <strong>${courseName}</strong>.</p>
        <p>Please find your invoice attached to this email.</p>
        <br/>
        <p style="color:#999;font-size:12px">EduSync · support@edusync.com</p>
      </div>
    `,
    attachments: [
      {
        filename: `${invoiceNumber}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
};