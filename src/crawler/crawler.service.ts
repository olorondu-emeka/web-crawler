import * as cheerio from 'cheerio';

import { fetchWebsite } from '../http/fetch';
import { formatLink } from '../internal/utils';

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
      const formattedLink = formatLink(link, baseURL);
      if (!linksMap[formattedLink] && !visited[formattedLink]) {
        validLinks.push(formattedLink);
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
  const html = await fetchWebsite(formattedLink, retries);
  const children = [];

  if (html) {
    const relativeLinks = getLinksFromWebsite(visited, html, baseURL);

    for (const link of relativeLinks) {
      const result = await processLink(baseURL, link, visited, retries);
      children.push(result);
    }

    return {
      url: formattedLink,
      count: children.length,
      children
    };
  }

  return null;
}
