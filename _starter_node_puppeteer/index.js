const chromium = require('chrome-aws-lambda');

const DEFAULT_TIMEOUT = 5000;

/**
 * @typedef {import('puppeteer-core').Page} Page
 */

/**
 * @param {Page} page 
 */
const getData = async (page) => {
  const selector = `input[value*="Feeling Lucky"]`;
  await page.waitForSelector(selector);
  return await page.$eval(selector, el => el.value);
};

exports.handler = async (_, context) => {
  let result = null;
  let browser = null;
  
  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    page.setDefaultTimeout(DEFAULT_TIMEOUT);
    await page.goto('https://www.google.com');
    const data = await getData(page);

    result = JSON.stringify({data}, null, 2);
  } catch (error) {
    return context.fail(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

  return context.succeed({statusCode: 200, body: result});
};
