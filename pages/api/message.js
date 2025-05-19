import { askDeepSeek } from '../../deepseek';
import { scrapeHeadlines } from '../../scrape';

let session = {
  intent: null,
  domain: null,
  auditType: null
};


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    console.log('🧠 Received:', message);
    let reply;

    // Step 0 — First time: kick off
    if (!session.intent) {
      const systemPrompt = `You're a router for an SEO bot. The user will chat naturally. Identify if they are asking for on-page SEO help. Reply with only this format:
{
  "intent": "onPageSEO" | "generalQuery",
  "question": "Text you want the bot to ask next"
}`;
      const deepResponse = await askDeepSeek(systemPrompt, message);
      const { intent, question } = JSON.parse(deepResponse);
      session.intent = intent;

      reply = {
        type: 'text',
        data: question || "Great! How can I assist with SEO today?"
      };
      return res.status(200).json({ reply });
    }

    // Step 1 — Intent is onPageSEO but domain not provided
    if (session.intent === 'onPageSEO' && !session.domain) {
      const domainMatch = message.match(/(https?:\/\/)?([\w-]+\.)+[\w-]+/);
      if (domainMatch) {
        session.domain = domainMatch[0];
        reply = {
          type: 'text',
          data: `Thanks! What would you like me to check on ${session.domain}?\n\nOptions:\n- Title Tag\n- Meta Description\n- Headings\n- Alt Tags\n- Internal Links`
        };
      } else {
        reply = {
          type: 'text',
          data: "Please provide the website you'd like to analyze."
        };
      }
      return res.status(200).json({ reply });
    }

    // Step 2 — User picks what to audit
    if (session.domain && !session.auditType) {
      const lowered = message.toLowerCase();
      if (lowered.includes('title')) session.auditType = 'title';
      else if (lowered.includes('meta')) session.auditType = 'meta';
      else if (lowered.includes('heading')) session.auditType = 'headings';
      else if (lowered.includes('alt')) session.auditType = 'alt';
      else if (lowered.includes('internal')) session.auditType = 'links';

      if (!session.auditType) {
        reply = {
          type: 'text',
          data: "Please choose one of: Title Tag, Meta Description, Headings, Alt Tags, Internal Links."
        };
      } else {
        // ✅ Do scraping
        const result = await scrapeOnPageSEO(session.domain, session.auditType);
        reply = {
          type: 'cards',
          data: result
        };

        // Reset session
        session = {
          intent: null,
          domain: null,
          auditType: null
        };
      }

      return res.status(200).json({ reply });
    }

    // Fallback
    reply = {
      type: 'text',
      data: "I'm not sure how to help with that. Try asking about on-page SEO."
    };
    return res.status(200).json({ reply });

  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

