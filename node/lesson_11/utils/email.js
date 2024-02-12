const nodemailer = require('nodemailer');
const sendEmail = async(options) => {
  //Three steps to send email
  //1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    //Activate "less secure app" option in your gmail
    //using gamil we can only send 500 email per day and we will marked spam
    //In production we generally use sendgrade or mailgun
  });
  //2)Define Email options
  const mailOptions = {
    from: 'Junaid <jal665@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //3) Actually send email with node mailer
  await transporter.sendMail(mailOptions);

};
module.exports = sendEmail;