require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
    host: "smtps.udag.de",
    port: 587, // Use 465 if SSL is needed
    secure: false, // False for STARTTLS, true for SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

app.post('/send-email', async (req, res) => {
    const { to, subject, body } = req.body;

    try {
        await transporter.sendMail({
            from: '"Data Collector" <no-reply-ds@mmthealthcare.de>',
            to,
            subject,
            text: body
        });

        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error("Email Error:", error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SMTP Server running on port ${PORT}`));
