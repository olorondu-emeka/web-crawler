export interface CrawlerResult {
  rootURL: string;
  totalLinks: number;
  links: ChildLink[];
}

export interface ChildLink {
  childURL: string;
  siteLinks: string[];
  linkCount: number;
}

export interface CrawlerConfig {
  retries?: number;
  chunkSize?: number;
}
