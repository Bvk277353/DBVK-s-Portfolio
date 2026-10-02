const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Enable CORS for your GitHub Pages frontend
app.use(cors({
    origin: 'https://github.io' // Matches your exact root domain
}));

app.post('/api/contact', async (req, res) => {
    const { from_name, reply_to, message } = req.body;

    // Securely pull parameters from Render's Environment Variables
    const SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
    const PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
    const PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY; 
    const NOTIFICATION_TEMPLATE_ID = process.env.EMAILJS_NOTIF_TEMPLATE;
    const AUTOREPLY_TEMPLATE_ID = process.env.EMAILJS_AUTO_TEMPLATE;

    if (!SERVICE_ID || !PUBLIC_KEY || !PRIVATE_KEY) {
        return res.status(500).json({ success: false, error: 'Server configuration missing credentials.' });
    }

    try {
        const createPayload = (templateId) => ({
            service_id: SERVICE_ID,
            template_id: templateId,
            user_id: PUBLIC_KEY,
            accessToken: PRIVATE_KEY,
            template_params: { from_name, reply_to, message }
        });

        // FIX: Restored the true corporate endpoint paths for EmailJS REST delivery agents
        const [res1, res2] = await Promise.all([
            fetch('https://emailjs.com', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(createPayload(NOTIFICATION_TEMPLATE_ID))
            }),
            fetch('https://emailjs.com', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(createPayload(AUTOREPLY_TEMPLATE_ID))
            })
        ]);

        if (res1.ok && res2.ok) {
            return res.status(200).json({ success: true, message: 'Message sent successfully!' });
        } else {
            const errText = await res1.text() || await res2.text();
            throw new Error(errText || 'EmailJS service rejected the transmission.');
        }

    } catch (error) {
        console.error('Server Relay Error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => console.log(`Secure Email Agent active on port ${PORT}`));
