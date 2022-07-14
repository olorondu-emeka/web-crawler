import { hrtime, stdin, stdout } from 'process';

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
    const crawler = new WebCrawler({ retries: 1 });
    const start = hrtime.bigint();

    const result = await crawler.crawl(url);

    console.log('\nfinal result', result);

    const end = hrtime.bigint();
    console.info(`\nExecution time: ${(end - start) / BigInt(10 ** 6)}ms`);

    consoleInterface.close();
  });
}

example();
