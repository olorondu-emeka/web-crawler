/**
 * loops through an array and processes the callback function for each array item in parallel (i.e, concurrently)
 * @param items the array to be proccessed
 * @param callback async function to be called for each array item
 * @returns
 */
export async function asyncParallelLoop<T>(
  items: any[],
  callback: Function
): Promise<T[]> {
  const promises = items.map((item) => callback(item));
  return Promise.all(promises);
}

/**
 * similar to `asyncParallelLoop` but processes the callback function for each array item in series (i.e, synchronously)
 * @param items
 * @param callback
 * @returns
 */
export async function asyncSeriesLoop<T>(
  items: string[][],
  callback: Function
) {
  let finalResult: T[] = [];

  // const lastResolvedPromise = await callback(items[0]);

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

/**
 * processes an array of batches concurrently by running each batch in parallel
 * @param batchArray an array of batches
 * @param callback callback function for every item in each batch
 */
export async function concurrentLoop<T>(
  batchArray: string[][],
  callback: (item: string) => Promise<T>
) {
  return asyncSeriesLoop<T>(batchArray, async (batch: string[]) => {
    const batchResult = await asyncParallelLoop<Node>(batch, callback);

    return batchResult;
  });
}
