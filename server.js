const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();

const PORT = process.env.PORT || 3000;

// -------------------------
// Middleware
// -------------------------

app.use(cors({
    origin: 'https://bvk277353.github.io',
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());


// -------------------------
// Health Check
// -------------------------

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Portfolio backend is running.'
    });
});


// -------------------------
// Contact Form
// -------------------------

app.post('/api/contact', async (req, res) => {

    const {
        from_name,
        reply_to,
        message
    } = req.body;

    // Validate input
    if (!from_name || !reply_to || !message) {
        return res.status(400).json({
            success: false,
            error: 'Name, email and message are required.'
        });
    }

    // EmailJS environment variables
    const SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
    const PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
    const PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;

    const NOTIFICATION_TEMPLATE_ID =
        process.env.EMAILJS_NOTIF_TEMPLATE;

    const AUTOREPLY_TEMPLATE_ID =
        process.env.EMAILJS_AUTO_TEMPLATE;


    // Check credentials
    if (
        !SERVICE_ID ||
        !PUBLIC_KEY ||
        !PRIVATE_KEY ||
        !NOTIFICATION_TEMPLATE_ID ||
        !AUTOREPLY_TEMPLATE_ID
    ) {
        console.error('Missing EmailJS environment variables.');

        return res.status(500).json({
            success: false,
            error: 'Server configuration is incomplete.'
        });
    }


    // EmailJS API endpoint
    const EMAILJS_URL =
        'https://api.emailjs.com/api/v1.0/email/send';


    // Create EmailJS request
    const createPayload = (templateId) => ({
        service_id: SERVICE_ID,
        template_id: templateId,
        user_id: PUBLIC_KEY,
        accessToken: PRIVATE_KEY,

        template_params: {
            from_name: from_name,
            reply_to: reply_to,
            message: message
        }
    });


    try {

        // -------------------------
        // Send notification email
        // -------------------------

        const notificationResponse = await fetch(EMAILJS_URL, {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(
                createPayload(NOTIFICATION_TEMPLATE_ID)
            )
        });


        const notificationText =
            await notificationResponse.text();


        if (!notificationResponse.ok) {

            console.error(
                'Notification EmailJS Error:',
                notificationText
            );

            throw new Error(
                notificationText ||
                'EmailJS notification failed.'
            );
        }


        // -------------------------
        // Send auto-reply email
        // -------------------------

        const autoReplyResponse = await fetch(EMAILJS_URL, {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(
                createPayload(AUTOREPLY_TEMPLATE_ID)
            )
        });


        const autoReplyText =
            await autoReplyResponse.text();


        if (!autoReplyResponse.ok) {

            console.error(
                'Auto Reply EmailJS Error:',
                autoReplyText
            );

            throw new Error(
                autoReplyText ||
                'EmailJS auto-reply failed.'
            );
        }


        // -------------------------
        // Success
        // -------------------------

        console.log('Contact form email sent successfully.');

        return res.status(200).json({
            success: true,
            message: 'Message sent successfully!'
        });


    } catch (error) {

        console.error(
            'Server Relay Error:',
            error
        );

        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


// -------------------------
// Start Server
// -------------------------

app.listen(PORT, () => {
    console.log(
        `Secure Email Agent active on port ${PORT}`
    );
});
