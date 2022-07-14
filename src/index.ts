import { hrtime, stdin, stdout } from 'process';

import WebCrawler from './crawler';
import { createInterface } from 'readline';
import { writeFile } from 'fs';

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
    const end = hrtime.bigint();

    console.info(`\nExecution time: ${(end - start) / BigInt(10 ** 9)}s`);

    // store result in result.json
    writeFile('result.json', JSON.stringify(result, null, 4), (err) => {
      if (err) {
        console.log('error writing to file', err);
      } else {
        console.log('\nFull result stored in "result.json"');
      }
    });

    consoleInterface.close();
  });
}

example();
