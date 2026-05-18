const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendVerificationEmail(email, link, title, content) {
    try {
        const response = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: title,
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