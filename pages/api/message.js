// pages/api/message.js
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { message } = req.body;

        // Call the API that connects to Claude or stock market API
        // For now, just return a mock response
        const response = { reply: `You asked about: ${message}` };

        res.status(200).json(response);
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}