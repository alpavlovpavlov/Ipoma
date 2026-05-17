const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Mail server is ready');
    }
});

async function sendEmail(email, link, title, content) {
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: title,
        html: `
            <p>${content}</p>
            <a href="${link}">Click</a>
            <p>This link expires in 30 minutes.</p>
        `,
        replyTo: process.env.EMAIL_REPLY_TO
    })
}

module.exports = {
    sendEmail
}