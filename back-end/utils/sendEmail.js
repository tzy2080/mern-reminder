const nodemailer = require('nodemailer');
require("dotenv").config();

// For sending simple email
const sendEmail = (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.HOST,
        port: 587,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        html: options.text
    };

    transporter.sendMail(mailOptions, (error, info) => {
       if(error) {
           console.log(error)
       } else {
           console.log(info)
       }
    });
}

module.exports = sendEmail;