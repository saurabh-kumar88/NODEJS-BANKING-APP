const nodemailer = require('nodemailer');

require('dotenv/config');

const transporter  = nodemailer.createTransport({
    service : "gmail",
    auth:{
        user:process.env.HOST_EMAIL,
        pass:process.env.HOST_PASS
    },
});

module.exports = transporter;