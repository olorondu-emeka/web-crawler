import * as cheerio from 'cheerio';

import { formatLink, randomDelay } from '../internal/utils';

import { fetchWebsite } from '../http/fetch';

/**
 * retrieves all href values from the <a> tag present in a website's HTML
 * @param html website's HTML
 * @param prefix prefix to separate relative links from external links
 * @param baseURL the website's URL
 */
export function getLinksFromWebsite(
  visited: Record<string, boolean>,
  html: string,
  baseURL: string
): string[] {
  const prefix = '/';
  const $ = cheerio.load(html);
  const validLinks: string[] = [];

  const links = $('a');

  // keeps track of duplicate links
  const linksMap: Record<string, boolean> = {};

  links.each(function () {
    const link = $(this).attr('href');

    const condition = link && link.length > 1 && link.startsWith(prefix);
    if (condition) {
      // console.log('hii');

      const formattedLink = formatLink(link, baseURL);
      if (!linksMap[formattedLink] && !visited[formattedLink]) {
        validLinks.push(link);
        linksMap[formattedLink] = true;
        visited[formattedLink] = true;
      }
    }
  });

  return validLinks;
}

/**
 * retrieves all href values from the <a> tag present in a website's HTML using the site's URL
 * @param link the website's URL
 */
export async function processLink(
  baseURL: string,
  childURL: string,
  visited: Record<string, boolean>,
  retries?: number
): Promise<any | null> {
  const formattedLink = formatLink(childURL, baseURL);
  console.log('formatted link', formattedLink);

  const html = await fetchWebsite(formattedLink, retries);
  // console.log('html', html);

  const children = [];

  if (html) {
    const relativeLinks = getLinksFromWebsite(visited, html, baseURL);
    console.log('relative links', relativeLinks);

    for (const link of relativeLinks) {
      // delay to safegueard against web-crawler detection enabed sites
      await randomDelay();

      const result = await processLink(baseURL, link, visited, retries);
      children.push(result);

      console.log('processed result', result);
    }

    console.log('visited', visited);
  }

  return {
    url: formattedLink,
    count: children.length,
    children
  };
}
