import { stdin, stdout } from 'process';

import WebCrawler from './worker';
import { createInterface } from 'readline';

function main() {
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

  //
}

main();
