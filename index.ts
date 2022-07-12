import * as cheerio from 'cheerio';

import axios from 'axios';

// interface Result {
//   url: string;
//   siteLinks: string[];
// }

async function fetchWebsite(url: string): Promise<string | null> {
  console.log(`Fetching data from ${url}`);

  const response = await axios.get(url);
  if (response.status !== 200) {
    console.log(
      'Data retrieval unsuccessful with status code:',
      response.status
    );
    return null;
  }

  console.log(`data fetched from ${url}`);
  return response.data;
}

function getLinksFromWebsite(html: string, prefix = '', baseURL?: string) {
  const $ = cheerio.load(html);
  const validLinks: string[] = [];

  const links = $('a');
  links.each(function () {
    const link = $(this).attr('href');

    const condition = link && link.length > 1 && link.startsWith(prefix);
    if (condition) {
      const formattedLink = prefix.length ? `${baseURL}${link}` : link;
      validLinks.push(formattedLink);
    }
  });

  console.log('total links:', validLinks.length);
  return validLinks;
}

async function main(url: string) {
  const html = await fetchWebsite(url);

  if (!html) return;

  //   const finalResult: Result[] = [];
  const rootLinks = getLinksFromWebsite(html, '/', url);
  const queue = [];

  for (let link of rootLinks) {
    // queue.push(async function () {
    //   console.log('starting async function', link);
    //   const site = await fetchWebsite(link);
    //   if (site) {
    //     const linkArray = getLinksFromWebsite(site);
    //     finalResult.push({ url: site, siteLinks: linkArray });
    //   }

    //   console.log('ending async function', link);
    // });

    queue.push(fetchWebsite(link));
  }
  const childrenHTML = await Promise.all(queue);
  console.log('final result', childrenHTML.length);
}

main('https://monzo.com');
