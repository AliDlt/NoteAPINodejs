const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

require("dotenv").config();

const transporterDetails = {
  host: process.env.EMAIL_HOSTNAME,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(
  smtpTransport(transporterDetails)
);

async function sendConfirmationEmail(fullname, userEmail, confirmationToken) {
  try {
    const url = `${
      "http://" + process.env.URL + ":" + process.env.PORT
    }/api/confirm-email/${confirmationToken}`;

    const info = await transporter.sendMail({
      from: "no-reply@alidlt.ir",
      to: userEmail,
      subject: "User account verification",
      text: `Click the following link to confirm your email: ${url}`,
      html: `<p>Hi ${fullname},</p>
         <p>Click the following link to confirm your email: <a href="${url}">${url}</a></p>
         <p>If you didn't request this email, please ignore it.</p>
         <p>Thanks,<br>Your App Team</p>`,
    });
    return {
      status: true,
      message: "Email sent successfully",
      info: info,
    };
  } catch (error) {
    throw {
      status: false,
      message: "Error sending email",
      error: error,
    };
  }
}

module.exports = { sendConfirmationEmail };
