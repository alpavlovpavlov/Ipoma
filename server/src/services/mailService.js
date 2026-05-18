// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true,
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     }
// })

// async function sendEmail(email, link, title, content) {
//     await transporter.sendMail({
//         from: process.env.EMAIL_FROM,
//         to: email,
//         subject: title,
//         html: `
//             <p>${content}</p>
//             <a href="${link}">Click</a>
//             <p>This link expires in 30 minutes.</p>
//         `,
//         replyTo: process.env.EMAIL_REPLY_TO
//     })
// }

// module.exports = {
//     sendEmail
// }

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendVerificationEmail(email, link, title, content) {
    try {
        const response = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: title,//'Verify your email',
            html: `
                <p>${content}</p>
                <a href="${link}">Verify Email</a>
                <p>This link expires in 30 minutes.</p>
            `
        });
        
        console.log('Email sent:', response);
        
    } catch (error) {
        console.log('Resend error:', error);
        throw error;
    }
}

module.exports = {
    sendVerificationEmail
}