import * as cheerio from 'cheerio';

import { formatLink, randomDelay, splitToBatches } from '../internal/utils';

import { Node } from './crawler.model';
import { concurrentLoop } from '../internal';
import { fetchWebsite } from '../http/fetch';

/**
 * retrieves all href values from the <a> tag present in a website's HTML
 * @param visited a hashmap of visited sites
 * @param html website's HTML
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

  // keeps track of duplicate links (map instead of a list to enhance performance during retrieval)
  const linksMap: Record<string, boolean> = {};

  links.each(function () {
    const link = $(this).attr('href');

    const condition = link && link.length > 1 && link.startsWith(prefix);
    if (condition) {
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
 * builds an N-ary (generic) tree of all links and their corresponding children
 * @param baseURL the root url
 * @param childURL the relative link e.g `/about-us`
 * @param visited a ma of visited sites
 * @param retries number of retries for each HTTTP request
 */
export async function processLink(
  baseURL: string,
  childURL: string,
  visited: Record<string, boolean>,
  retries?: number,
  batchSize?: number
): Promise<Node> {
  const formattedLink = formatLink(childURL, baseURL);

  // delay to safegueard against web-crawler detection enabed sites
  await randomDelay();

  const html = await fetchWebsite(formattedLink, retries);
  let children: Node[] = [];

  if (html) {
    const relativeLinks = getLinksFromWebsite(visited, html, baseURL);

    // process in batches
    const batches = splitToBatches<string>(relativeLinks, batchSize);

    if (batches.length) {
      children = await concurrentLoop(batches, (link: string) =>
        processLink(baseURL, link, visited, retries, batchSize)
      );
    }
  }

  return {
    url: formattedLink,
    count: children.length,
    children
  };
}
