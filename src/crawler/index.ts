import { CrawlerConfig } from './crawler.model';
import { processLink } from './crawler.service';

export default class WebCrawler {
  private visited: Record<string, boolean>;

  constructor(private config?: CrawlerConfig) {
    this.visited = {};
  }

  /**
   * crawls a website given a URL
   * @param url the root url to be crawled
   */
  async crawl(baseURL: string): Promise<any | undefined> {
    this.visited[baseURL] = true;

    console.log(`\nFetching data from ${baseURL}`);

    const result = await processLink(
      baseURL,
      '',
      this.visited,
      this?.config?.retries
    );

    console.log('visited', this.visited);
    return result;
  }
}
