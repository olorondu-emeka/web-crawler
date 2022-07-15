import { promisify } from 'util';

/**
 * differentiates betweeen a relative link within the same domain and an external link
 * @param link link to be formatted
 * @param prefix link prefix
 * @param baseURL parent URL for a relative link (optional)
 */
export function formatLink(link: string, baseURL?: string): string {
  const formattedLink = `${baseURL}${link}`;
  if (formattedLink.endsWith('/')) {
    return formattedLink.substring(0, formattedLink.length - 1);
  }

  if (formattedLink.includes('#')) {
    const index = formattedLink.indexOf('#');
    return formattedLink[index - 1] === '/'
      ? formattedLink.substring(0, index - 1)
      : formattedLink.substring(0, index);
  }

  return formattedLink;
}

/**
 * splits an array into a predefined number of batches
 * @param items array to be split
 * @param batchSize batch size for the array
 */
export function splitToChunks<T>(items: T[], batchSize?: number): Array<T[]> {
  const maxChunkSize = batchSize ? Math.max(0, Number(batchSize)) : 10;
  const batches = [];
  for (let i = 0; i < items.length; i += maxChunkSize) {
    batches.push(items.slice(i, maxChunkSize + i));
  }

  return batches;
}

export const sleep = promisify(setTimeout);

/**
 * async delay for a random amount of time
 * @param min minimum number of milliseconds
 * @param max  maximum number of milliseconds
 */
export async function randomDelay(min = 200, max = 400): Promise<void> {
  const randomSeconds = Math.floor(Math.random() * (max - min)) + (min + 1);
  await sleep(randomSeconds);
}
