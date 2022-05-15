const nodemailer = require('nodemailer');
// const pug = require('pug');
// const htmlToText = require('html-to-text');
// const { resetPassword } = require('../controllers/authController');

// module.exports = class Email {
//     constructor(user, url) {
//         this.to = user.email;
//         this.firstName = user.name.split(' ')[0];
//         this.url = url;
//         this.from = `Shaurya Verma <process.env.EMAIL_FROM>`;
//     }

//     newTransport() {
//         if (process.env.NODE_ENV == 'production') {

//             return nodemailer.createTransport({
//                 service: 'SendGrid',
//                 auth: {
//                     user: process.env.SENDGRID_USERNAME,
//                     pass: process.env.SENDGRID_PASSWORD
//                 }
//             });
//         }
//         return nodemailer.createTransport({
//             host: process.env.EMAIL_HOST,
//             port: process.env.EMAIL_PORT,
//             auth: {
//                 user: process.env.EMAIL_USERNAME,
//                 pass: process.env.EMAIL_PASSWORD
//             }
//         });
//     }

//     async send(template, subject) {

//         // 1. render pug template 
//         const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
//             firstName: this.firstName,
//             url: this.url,
//             subject
//         });

//         // 2. set email options
//         const emailOptions = {
//             from: this.from,
//             to: this.to,
//             subject: subject,
//             html,
//             text: htmlToText.fromString(html)
//         };

//         // 3. create a transport and send email
//         await this.newTransport().sendMail(emailOptions);

//     }

//     async sendWelcome() {
//         await this.send('welcome', 'Welcome to the Natours Family');
//     }

//     async sendPasswordResetEmail() {
//         await this.send('resetPassword', 'Your Password reset token (Valid for only 10 minutes.)');
//     }
// }

const sendEmail = async (options) => {
    // // 1. create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // 2.Define email options
    const emailOptions = {
        from: 'Shaurya Verma <shaurya@shaurya.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    // 3.send the email
    await transporter.sendMail(emailOptions);

};

module.exports = sendEmail;