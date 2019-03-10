const nodemailer = require("nodemailer");
const configuration = require('../Constants/configuration')

async function sendMail(senderEmail, subject, message, html){
    let transporter = nodemailer.createTransport({
        host: "smtp.mail.yahoo.com",
        port: 587,
        secure: false,
        auth: {
            user: configuration.email,
            pass: configuration.password
        }
    });
    let mailOptions = {
        from: configuration.email,
        to: senderEmail,
        subject: subject,
        text: message,
        html: html
    };
    let info = await transporter.sendMail(mailOptions)
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

module.exports = {
    sendEmail: sendMail
}
