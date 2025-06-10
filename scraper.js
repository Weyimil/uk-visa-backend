const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function scrapeGovUk() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.gov.uk/browse/visas-immigration/visit-visas', { waitUntil: 'networkidle2' });

  const visas = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a.govuk-link')).map(a => ({
      title: a.innerText.trim(),
      url: a.href
    })).filter(item => item.title && item.url.startsWith('https://www.gov.uk'));
  });

  const filePath = path.join(__dirname, 'data', 'visas.json');
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(visas, null, 2));

  console.log(`✅ Saved ${visas.length} visas to data/visas.json`);
  await browser.close();
}

scrapeGovUk().catch(console.error);
