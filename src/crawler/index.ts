import { ChildLink, CrawlerConfig, CrawlerResult } from './crawler.model';
import { asyncParallelLoop, asyncSeriesLoop, splitToChunks } from '../internal';
import { getLinksFromWebsite, processRootLinks } from './crawler.service';

import { fetchWebsite } from '../http';

export default class WebCrawler {
  constructor(private config?: CrawlerConfig) {}

  /**
   * crawls a website given a URL
   * @param url the root url to be crawled
   */
  async crawl(url: string): Promise<CrawlerResult | undefined> {
    console.log(`\nFetching data from ${url}`);

    const html = await fetchWebsite(url, this?.config?.retries);
    if (!html) {
      return;
    }

    const rootLinks = getLinksFromWebsite(html, '/', url);

    // process in chunks
    const chunks = splitToChunks<string>(rootLinks, this?.config?.chunkSize);

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
    const finalResult: CrawlerResult = {
      rootURL: url,
      totalLinks: rootLinks.length,
      links: processedLinks
    };
    console.log(`
      Final Result:\t
      -------------
    `);
    console.log('rootURL:', finalResult.rootURL);
    console.log('totalLinks:', finalResult.totalLinks);
    console.log('links:\n', finalResult.links);

    return finalResult;
  }
}
