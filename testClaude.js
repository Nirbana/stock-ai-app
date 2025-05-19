require('dotenv').config({ path: '.env.local' });
const { askClaude } = require('./claude');

(async () => {
  const response = await askClaude(
    "You are an intelligent router that determines which backend action to invoke.",
    "Get me the stock price of RELIANCE.NS"
  );
  console.log(response);
})();