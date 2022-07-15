export interface Node {
  url: string;
  count: number;
  children: Node[];
}

export interface CrawlerConfig {
  retries?: number;
  batchSize?: number;
}
