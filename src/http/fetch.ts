import axios from 'axios';

export async function fetchWebsite(
  url: string,
  retries = 3
): Promise<string | null> {
  let success = false;
  let result = null;
  let count = 0;

  while (!success) {
    try {
      if (count === retries) {
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
