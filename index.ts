import * as cheerio from 'cheerio';

import { asyncParallelLoop, asyncSeriesLoop, splitToChunks } from './utils';

// import { asyncSeriesLoop } from './utils';
// import { Worker } from 'worker_threads';
import axios from 'axios';

// import { hrtime } from 'process';

interface Result {
  url: string;
  siteLinks: string[];
}

export async function fetchWebsite(url: string): Promise<string | null> {
  console.log(`Fetching data from ${url}`);

  const response = await axios.get(url);
  if (response.status !== 200) {
    console.log(
      'Data retrieval unsuccessful with status code:',
      response.status
    );
    return null;
  }

  console.log(`data fetched from ${url}`);
  return response.data;
}

export function getLinksFromWebsite(
  html: string,
  prefix = '',
  baseURL?: string
) {
  const $ = cheerio.load(html);
  const validLinks: string[] = [];

  const links = $('a');
  links.each(function () {
    const link = $(this).attr('href');

    const condition = link && link.length > 1 && link.startsWith(prefix);
    if (condition) {
      const formattedLink = prefix.length ? `${baseURL}${link}` : link;
      validLinks.push(formattedLink);
    }
  });

  console.log('total links:', validLinks.length);
  return validLinks;
}

async function processRootLinks(link: string) {
  const site = await fetchWebsite(link);
  if (site) {
    // const linkArray = getLinksFromWebsite(site);
    // return { url: link, siteLinks: linkArray };
    return { url: link };
  }

  return null;
}

async function main(url: string) {
  const html = await fetchWebsite(url);

  if (!html) return;

  const rootLinks = getLinksFromWebsite(html, '/', url);

  // process in chunks
  const chunks = splitToChunks<string>(rootLinks.slice(0, 20), 5);

  //
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

      //   console.log('chunk result', chunkResult);
      return chunkResult;
    }
  );

  console.log('final result', finalResult, finalResult.length);
}

main('https://monzo.com');
