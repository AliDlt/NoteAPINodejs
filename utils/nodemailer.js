const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

const transporterDetails = smtpTransport({
  host: "mail.alidlt.ir",
  port: 465,
  secure: true,
  auth: {
    user: "no-reply@alidlt.ir",
    pass: "X7SWoVI5Rs8-",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

function sendConfirmationEmail(userEmail, confirmationToken) {
  const transporter = nodemailer.createTransport(transporterDetails);
  transporter.sendMail({
    from: "no-reply@alidlt.ir",
    to: userEmail,
    subject: "تائید حساب کاربری",
    html: `<p>Click the following link to confirm your email: <a href="http://your-app.com/confirm/${confirmationToken}">Confirm Email</a></p>`,
  });
}

function sendEmail(userEmail) {
  const transporter = nodemailer.createTransport(transporterDetails);
  transporter.sendMail({
    from: "no-reply@alidlt.ir",
    to: userEmail,
    subject: "تائید حساب کاربری",
    html: `<p>Click the following link to confirm your email: <a href="http://your-app.com/confirm/S">Confirm Email</a></p>`,
  });
}

module.exports = { sendConfirmationEmail, sendEmail };
