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
  html: string,
  prefix = '',
  baseURL?: string
): string[] {
  const $ = cheerio.load(html);
  const validLinks: string[] = [];

  const links = $('a');
  const linksMap: Record<string, boolean> = {};

  links.each(function () {
    const link = $(this).attr('href');

    const condition = link && link.length > 1 && link.startsWith(prefix);
    if (condition) {
      const formattedLink = formatLink(link, prefix, baseURL);
      if (!linksMap[formattedLink]) {
        validLinks.push(formattedLink);
        linksMap[formattedLink] = true;
      }
    }
  });

  return validLinks;
}

/**
 * retrieves all href values from the <a> tag present in a website's HTML using the site's URL
 * @param link the website's URL
 */
export async function processRootLinks(link: string): Promise<any | null> {
  const site = await fetchWebsite(link);
  if (site) {
    const linkArray = getLinksFromWebsite(site);

    return {
      childURL: link,
      siteLinks: linkArray,
      linkCount: linkArray.length
    };
  }

  return null;
}
