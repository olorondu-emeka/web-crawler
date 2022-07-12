export function calculateResponseTime(start: bigint, end: bigint) {
  return (end - start) / BigInt(10 ** 6);
}

export function formatLink(
  link: string,
  prefix: string,
  baseURL?: string
): string {
  const formattedLink = prefix.length ? `${baseURL}${link}` : link;
  if (formattedLink.endsWith('/')) {
    return formattedLink.substring(0, formattedLink.length - 1);
  }

  return formattedLink;
}

export function splitToChunks<T>(items: T[], chunkSize = 20): Array<T[]> {
  const chunks = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, chunkSize + i));
  }

  return chunks;
}

export async function asyncParallelLoop<T>(
  items: any[],
  callback: Function
): Promise<T[]> {
  const promises = items.map((item) => callback(item));
  return Promise.all(promises);
}

// export function asyncSeriesLoop
export async function asyncSeriesLoop<T>(
  items: string[][],
  callback: Function
) {
  let finalResult: T[] = [];

  const lastResolvedPromise = await items.reduce(
    async (previousPromise: Promise<any>, currentItem: string[]) => {
      const result = await previousPromise;

      if (result) {
        finalResult = finalResult.concat(result);
      }

      return callback(currentItem);
    },
    Promise.resolve()
  );

  finalResult.push(...lastResolvedPromise);
  return finalResult;
}
