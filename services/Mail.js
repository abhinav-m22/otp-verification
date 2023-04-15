const nodemailer = require('nodemailer');
const dotenv = require("dotenv");

dotenv.config();

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    service: 'Gmail',

    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.PASS,
    }

});

async function sendMail(params) {
    console.log(params.OTP);
    var mailOptions = {
        to: params.to,
        subject: "Otp for registration is: ",
        html: `<h3>OTP for account verification is </h3><h1 style='font-weight:bold;'> ${params.OTP} </h1>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
    });
  }

  module.exports = { sendMail }