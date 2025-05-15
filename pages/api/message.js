import { scrapeHeadlines } from '../../scrape';
console.log('📨 [API HIT] /api/message'); 
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  let reply;

  if (message.toLowerCase().includes('scrape')) {
    reply = await scrapeHeadlines('https://www.moneycontrol.com');
    reply = '📰 Here are the top headlines:\n\n' + reply.join('\n');
  } else {
    reply = `You asked about: ${message}`;
  }

  res.status(200).json({ reply });
}