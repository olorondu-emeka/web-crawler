import * as cheerio from 'cheerio';

// import { ChildLink } from './worker.model';
import { fetchWebsite } from '../http/fetch';
import { formatLink } from '../internal/utils';

export function getLinksFromWebsite(
  html: string,
  prefix = '',
  baseURL?: string
) {
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

  // console.log('total links:', validLinks.length);
  return validLinks;
}

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
