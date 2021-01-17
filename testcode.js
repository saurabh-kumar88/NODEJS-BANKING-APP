var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'saurabhkmr70@gmail.com',
    pass: 'rovwvhyvtpcdximj'
  }
});

var mailOptions = {
  from: 'saurabhkmr70@gmail.com',
  to: 'ykings.saurabh@gmail.com',
  subject: 'Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
