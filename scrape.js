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
      const items = Array.from(document.querySelectorAll('a'));
      return items
        .map(el => el.innerText.trim())
        .filter(text => text.length > 30 && !text.includes('moneycontrol.com'))
        .slice(0, 5);
    });

    await browser.close();
    return headlines;
  } catch (err) {
    await browser.close();
    return [`Error scraping: ${err.message}`];
  }
}
async function scrapeStockPrice(symbol = 'TCS.NS') {
  const url = `https://finance.yahoo.com/quote/${symbol}`;
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
    );

    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const price = await page.evaluate(() => {
      const el = document.querySelector('fin-streamer[data-field="regularMarketPrice"]');
      return el ? el.innerText : null;
    });

    await browser.close();

    if (price) {
      return `💹 The current price of ${symbol} is ₹${price}`;
    } else {
      return `Couldn't find price for ${symbol}`;
    }
  } catch (err) {
    await browser.close();
    return `Error scraping price for ${symbol}: ${err.message}`;
  }
}

// CLI test
if (require.main === module) {
  scrapeHeadlines('https://www.moneycontrol.com')
    .then(console.log)
    .catch(console.error);
}

async function scrapeOnPageSEO(domain, type) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(domain, { waitUntil: 'domcontentloaded' });

    const result = await page.evaluate((type) => {
      const results = [];

      if (type === 'title') {
        const title = document.querySelector('title');
        results.push(title ? `Title Tag: ${title.innerText}` : 'No title tag found.');
      }

      if (type === 'meta') {
        const meta = document.querySelector('meta[name="description"]');
        results.push(meta ? `Meta Description: ${meta.content}` : 'No meta description found.');
      }

      if (type === 'headings') {
        const headings = Array.from(document.querySelectorAll('h1, h2, h3')).map(h => `${h.tagName}: ${h.innerText}`);
        results.push(...(headings.length ? headings : ['No H1-H3 headings found.']));
      }

      if (type === 'alt') {
        const images = Array.from(document.querySelectorAll('img'));
        const missingAlts = images.filter(img => !img.alt || img.alt.trim() === '');
        results.push(`${missingAlts.length} images missing alt text.`);
      }

      if (type === 'links') {
        const links = Array.from(document.querySelectorAll('a[href^="/"], a[href*="yourdomain.com"]'));
        const linkList = links.map(a => a.href);
        results.push(`Found ${linkList.length} internal links.`);
      }

      return results;
    }, type);

    await browser.close();
    return result;

  } catch (err) {
    await browser.close();
    return [`Error scraping ${domain}: ${err.message}`];
  }
}


module.exports = {
  scrapeHeadlines,
  scrapeStockPrice,
  scrapeOnPageSEO,
};