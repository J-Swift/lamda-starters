const chromium = require('chrome-aws-lambda');

const DEFAULT_TIMEOUT = 10000;

const METASCORE_SECTION_SELECTOR = '.score_summary.metascore_summary';
const USERSCORE_SECTION_SELECTOR = '.score_summary:not(.yourscore_summary):not(.metascore_summary):not(.yourscore_login)';
const SCORE_SELECTOR = '.metascore_w';

/**
 * @typedef {import('puppeteer-core').Page} Page
 */


 /**
  * 
  * @param {Page} page the page
  * @param {string} selector the selector to search for
  * @returns {Promise<(number|undefined)>} the parsed score, or undefined if no score is available
  */
 const parseScoreForSection = async (page, selector) => {
  const strScore = await page.waitForSelector(selector)
    .then(section => section.$eval(SCORE_SELECTOR, el => el.innerText))
    .catch(_ => undefined);

  return Number(strScore);
 };

/**
 * @param {Page} page
 */
const getData = async (page) => {
  const metascore = await parseScoreForSection(page, METASCORE_SECTION_SELECTOR);
  const userscore = await parseScoreForSection(page, USERSCORE_SECTION_SELECTOR);

  return { metascore, userscore };
};

exports.handler = async (event, context) => {
  let result = null;
  let browser = null;

  const urlPath = event.urlPath;
  if (!urlPath) {
    return context.fail('Must provide a urlPath!');
  }

  const url = `https://www.metacritic.com/game/${urlPath}`;

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    page.setDefaultTimeout(DEFAULT_TIMEOUT);
    await page.goto(url);
    const data = await getData(page);

    result = JSON.stringify({url, ...data}, null, 2);
  } catch (error) {
    return context.fail(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

  return context.succeed({statusCode: 200, body: result});
};
