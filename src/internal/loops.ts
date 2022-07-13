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
