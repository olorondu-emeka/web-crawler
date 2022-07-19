import { CrawlerConfig } from './crawler.model';
import { Node } from './crawler.model';
import { processLink } from './crawler.service';

export default class WebCrawler {
  private visited: Record<string, boolean>;

  constructor(private config?: CrawlerConfig) {
    this.visited = {};
  }

  /**
   * crawls a website given a url
   * @param baseURL the root url to be crawled
   */
  async crawl(baseURL: string): Promise<Node> {
    this.visited[baseURL] = true;

    console.log(`\nFetching data from ${baseURL}`);

    const result = await processLink(
      baseURL,
      '',
      this.visited,
      this?.config?.retries
    );

    console.log('\nvisited', this.visited, Object.keys(this.visited).length);
    return result;
  }
}
