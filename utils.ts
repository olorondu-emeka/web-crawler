export function calculateResponseTime(start: bigint, end: bigint) {
  return (end - start) / BigInt(10 ** 6);
}

export function splitToChunks<T>(items: T[], chunkSize = 20): Array<T[]> {
  const chunks = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, chunkSize + i));
  }

  return chunks;
}

export async function asyncParallelLoop<T>(items: T[], callback: Function) {
  const promises = items.map((item) => callback(item));
  return Promise.all(promises);
}

// export function asyncSeriesLoop
export async function asyncSeriesLoop<T>(items: string[], callback: Function) {
  const finalResult: T[] = [];

  await items.reduce(
    async (previousPromise: Promise<any>, nextItem: string) => {
      const result = await previousPromise;
      if (result) {
        finalResult.push(result);
      }

      return callback(nextItem);
    },
    Promise.resolve()
  );

  return finalResult;
}

// export async function asyncSeriesLoop<T>(items: string[], callback: Function) {
//   const finalResult: T[] = [];

//   await items.reduce(
//     async (previousPromise: Promise<any>, nextItem: string) => {
//       const result = await previousPromise;
//       if (result) {
//         finalResult.push(result);
//       }

//       return callback(nextItem);
//     },
//     Promise.resolve()
//   );

//   return finalResult;
// }
