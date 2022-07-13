import WebCrawler from './worker';

async function main() {
  const crawler = new WebCrawler();
  await crawler.crawl('https://monzo.com');
}

main();
