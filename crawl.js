const jsdom = require("jsdom");
const { JSDOM } = jsdom;

async function crawlPage(baseUrl, currentUrl, pages) {
  try {
    let response = await fetch(currentUrl);
    if (response.status >= 400) {
      console.log(currentUrl);
      console.log(`Error: ${response.status}`);
      return;
    }

    const header = response.headers.get("Content-Type")
    const contentType = header ? header.split(';')[0].trim() : '';
    if (contentType !== "text/html") {
      console.log(`Non-Html content: ${contentType}`);
      return;
    }

    const html = await response.text();
    const anchors = getURLsFromHtml(html, baseUrl);

    for (const anchor of anchors) {
      const normalizedAnchor = normalizeURL(anchor);
      if(!sameDomain(baseUrl, anchor)) {
        continue;
      }

      if (!(normalizedAnchor in pages)) {
        pages[normalizedAnchor] = 1;
        await crawlPage(baseUrl, normalizeURL(anchor, protocol=true), pages);
      } else {
        pages[normalizedAnchor]++;
      }
    }

    return pages;

  } catch (error) {
    console.log(`exception: ${currentUrl}`);
    console.log(`Error fetching page: ${error}`);
  }
}

function getURLsFromHtml(html, baseUrl) {
  const dom = new JSDOM(html);
  const links = dom.window.document.querySelectorAll('a');
  let anchors = [];
  for (const anchor of links) {
    anchors.push(getAbsoluteURL(baseUrl, anchor.href));
  }

  return anchors;
}

function normalizeURL(url, protocol=false) {
  const parsedUrl = new URL(url);
  const username = parsedUrl.username;
  const pwd = parsedUrl.password;
  const domain = parsedUrl.hostname;
  const port = parsedUrl.port ? `:${parsedUrl.port}` : "";
  const path = parsedUrl.pathname;
  const search = parsedUrl.search;
  const auth = username && pwd ? `${username}:${pwd}@` : "";
  let normalized = `${auth}${domain}${port}${path}${search}`;
  normalized = normalized.replace(/([^:])\/{2,}/g, '$1/');
  normalized = normalized.replace(/\/+$/g, '');
  return protocol ? `${parsedUrl.protocol}//${normalized}` : normalized;
}

function sameDomain(url1, url2) {
  const u1 = new URL(url1);
  const u2 = new URL(url2);
  return u1.hostname === u2.hostname;
}

function getAbsoluteURL(baseUrl, urlPath) {
  if (urlPath.slice(0, 1) === '/') {
    const trimmedBaseUrl = baseUrl.replace(/\/+$/g, '');
    return `${trimmedBaseUrl}${urlPath}`
  }

  return urlPath;
}

module.exports = {
  normalizeURL,
  getURLsFromHtml,
  crawlPage,
  getAbsoluteURL
}