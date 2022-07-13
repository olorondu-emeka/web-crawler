export async function asyncParallelLoop<T>(
  items: any[],
  callback: Function
): Promise<T[]> {
  const promises = items.map((item) => callback(item));
  return Promise.all(promises);
}

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
