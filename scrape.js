const puppeteer = require('puppeteer');

async function scrapeHeadlines(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
    );

    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Extract first 5 headlines or section titles from <h1>, <h2>, or <a>
    const headlines = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('h1, h2, a'));
      return elements
        .map(el => el.innerText.trim())
        .filter(text => text.length > 10)  // Filter short texts like "Home"
        .slice(0, 5);  // Limit to 5
    });

    await browser.close();
    return headlines;
  } catch (err) {
    await browser.close();
    return [`Error scraping: ${err.message}`];
  }
}

// CLI test
if (require.main === module) {
  scrapeHeadlines('https://www.moneycontrol.com')
    .then(console.log)
    .catch(console.error);
}

module.exports = { scrapeHeadlines };