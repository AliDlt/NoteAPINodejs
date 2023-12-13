const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

const transporterDetails = {
  host: "server01.clientspanel.com",
  port: 465,
  secure: true,
  auth: {
    user: "no-reply@alidlt.ir",
    pass: "X7SWoVI5Rs8-",
  },
};

const transporter = nodemailer.createTransport(
  smtpTransport(transporterDetails)
);

async function sendConfirmationEmail(fullname, userEmail, confirmationToken) {
  try {
    const info = await transporter.sendMail({
      from: "no-reply@alidlt.ir",
      to: userEmail,
      subject: "User account verification",
      text: `Click the following link to confirm your email: http://your-app.com/confirm/${confirmationToken}`,
      html: `<p>Hi ${fullname},</p>
         <p>Click the following link to confirm your email: <a href="http://your-app.com/confirm/${confirmationToken}">http://your-app.com/confirm/${confirmationToken}</a></p>
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
