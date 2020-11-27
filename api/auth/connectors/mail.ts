const mailer = require('nodemailer');
const transporter = mailer.createTransport({
    host: '198.54.126.144',
    port: '465',
    secure: true,
    auth: {
        user: 'no-reply@badquality.co',
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
    from: '"LST" <no-reply@badquality.co>',
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
        })
        .catch((err:Error|undefined) => {
        console.log(err);
        return reject(err);
        });
    });
}    

export default transporter;