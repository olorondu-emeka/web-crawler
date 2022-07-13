import { stdin, stdout } from 'process';

import WebCrawler from './crawler';
import { createInterface } from 'readline';

function example() {
  // read input from the console
  const consoleInterface = createInterface({
    input: stdin,
    output: stdout
  });

  // let url: string;
  consoleInterface.question('Enter URL (https://):\n', async (url) => {
    const crawler = new WebCrawler();
    await crawler.crawl(url);

    consoleInterface.close();
  });
}

example();
