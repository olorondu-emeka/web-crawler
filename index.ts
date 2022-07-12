import * as cheerio from 'cheerio';

import {
  asyncParallelLoop,
  asyncSeriesLoop,
  formatLink,
  splitToChunks
} from './utils';

import axios from 'axios';

// import { hrtime } from 'process';

interface Result {
  url: string;
  siteLinks: string[];
  linkCount: number;
}

export async function fetchWebsite(
  url: string,
  retries = 3
): Promise<string | null> {
  let success = false;
  let result = null;
  let count = 0;

  while (!success) {
    try {
      if (count === retries) {
        break;
      }

      const response = await axios.get(url);
      if (response.status !== 200) {
        console.log(
          'Data retrieval unsuccessful with status code:',
          response.status
        );
        return null;
      }

      result = response.data;
      success = true;
    } catch (error: any) {
      console.log('HTTP error:', error.message);
      count += 1;
    }
  }

  return result;
}

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

  console.log('total links:', validLinks.length);
  return validLinks;
}

async function processRootLinks(link: string): Promise<Result | null> {
  const site = await fetchWebsite(link);
  if (site) {
    const linkArray = getLinksFromWebsite(site);
    return { url: link, siteLinks: linkArray, linkCount: linkArray.length };
  }

  return null;
}

async function main(url: string) {
  console.log(`Fetching data from ${url}`);

  const html = await fetchWebsite(url);
  if (!html) {
    return;
  }

  const rootLinks = getLinksFromWebsite(html, '/', url);

  // process in chunks
  const chunks = splitToChunks<string>(rootLinks.slice(0, 20), 10);

  /**
   * the chunks array is processed in series.
   * however all items within each chunk are processed in parallel.
   */
  const finalResult = await asyncSeriesLoop<Result>(
    chunks,
    async (chunk: string[]) => {
      const chunkResult = await asyncParallelLoop<Result>(
        chunk,
        processRootLinks
      );

      return chunkResult;
    }
  );

  console.log('final result', finalResult, finalResult.length);
}

main('https://monzo.com');
