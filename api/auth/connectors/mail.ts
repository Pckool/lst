const mailer = require('nodemailer');
const mailUser = 'lst.app.mailer@gmail.com';
const transporter = mailer.createTransport({
    host: 'smtp.gmail.com',
    port: '465',
    secure: true,
    auth: {
        user: mailUser,
        pass: process.env.MAILER_PASS
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    }
});
interface EmailOptions {
    subject?: string;

}
export function sendEmail(recipiant: string, html: string, options: EmailOptions = {}) {
    var mailOptions = {
    from: `"LST" <${mailUser}>`,
    to: recipiant,
    subject: options.subject || 'Message from LST!',
    html: `${html}`

    }
    return new Promise((resolve, reject) => {
        if (html === '') return reject();
        transporter.sendMail(mailOptions)
        .then((info:any) => {
            console.log('Email sent!');
            return resolve(info);
        }).catch((err:Error|undefined) => {
            console.error(err);
            return reject(err);
        });
    });
}    

export default transporter;