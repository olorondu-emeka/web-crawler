import { asyncParallelLoop, asyncSeriesLoop, splitToChunks } from '../internal';
import { getLinksFromWebsite, processRootLinks } from './worker.service';

import { ChildLink } from './worker.model';
import { fetchWebsite } from '../http';

export default class WebCrawler {
  constructor(private retries?: number) {}

  /**
   * crawls a website given a URL
   * @param url the root url to be crawled
   */
  async crawl(url: string): Promise<void> {
    console.log(`Fetching data from ${url}`);

    const html = await fetchWebsite(url, this.retries);
    if (!html) {
      return;
    }

    const rootLinks = getLinksFromWebsite(html, '/', url);

    // process in chunks
    const chunks = splitToChunks<string>(rootLinks, 10);

    /**
     * the chunks array is processed in series.
     * however all items within each chunk are processed in parallel.
     */
    const processedLinks = await asyncSeriesLoop<ChildLink>(
      chunks,
      async (chunk: string[]) => {
        const chunkResult = await asyncParallelLoop<ChildLink>(
          chunk,
          processRootLinks
        );

        return chunkResult;
      }
    );

    // print result
    console.log(`
      Final Result:\t
      -------------
    `);
    console.log('rootURL:', url);
    console.log('totalLinks:', rootLinks.length);
    console.log('links:\n', processedLinks);
  }
}
