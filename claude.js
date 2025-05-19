const fetch = require('node-fetch');

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-3-sonnet-20240229';

async function askClaude(systemPrompt, userPrompt) {
  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ]
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Claude error response:', errorText);
    throw new Error(`Claude API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data?.content?.[0]?.text || 'No reply from Claude';
}

module.exports = { askClaude };