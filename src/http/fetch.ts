import axios from 'axios';

/**
 * HHTTP wrapper for fetching data from an API endpoint
 * @param url endpoint URL
 * @param retries number of retries (defaults to 3)
 */
export async function fetchWebsite(
  url: string,
  retries?: number
): Promise<string | null> {
  let success = false;
  let result = null;
  let count = 0;

  const maxRetries = retries ? Math.max(0, Number(retries)) : 3;

  while (!success) {
    try {
      if (count === maxRetries) {
        console.log(`${maxRetries} retries for ${url} failed`);
        break;
      }

      const response = await axios.get(url);
      if (response.status !== 200) {
        console.log(
          'Data retrieval unsuccessful with status code:',
          response.status
        );
        return null;
      }

      result = response.data;
      success = true;
    } catch (error: any) {
      console.log('HTTP error:', error.message);
      count += 1;
    }
  }

  return result;
}
