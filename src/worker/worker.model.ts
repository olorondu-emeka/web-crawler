export interface ChildLink {
  childURL: string;
  siteLinks: string[];
  linkCount: number;
}

export interface CrawlerConfig {
  retries?: number;
  chunkSize?: number;
}
