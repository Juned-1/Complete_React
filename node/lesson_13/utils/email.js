const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
//new Email(user,url).sendWlcome();
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Junaid <${process.env.EMAIL_FROM}>`;
    if(process.env.NODE_ENV === 'production'){
      this.from = `Junaid <${process.env.PROD_EMAIL_FROM}>`;
    }
  }
  newTransport() {
    //1) Create a transporte
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.PROD_EMAIL_FROM,
          pass: process.env.PROD_EMAIL_PASSWORD
        },
        secure: true
      });
    } else {
      return nodemailer.createTransport({
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
    }
  }
  async send(template, subject) {
    //send the actual email
    //1) Render HTML based on a pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      },
    );
    //2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html, {}), //text version of email better fro email delivery rate and spam folder
    };
    //3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }
  async sendWelcome() {
    await this.send('welcome', 'Welcome to the natours Family!');
  }
  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password Reset token (valid for 10 minutes)',
    );
  }
};
