/**
 * differentiates betweeen a relative link within the same domain and an external link
 * @param link link to be formatted
 * @param prefix link prefix
 * @param baseURL parent URL for a relative link (optional)
 */
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

/**
 * splits an array into a predefined number of chunks
 * @param items array to be split
 * @param chunkSize chunk size for the array
 */
export function splitToChunks<T>(items: T[], chunkSize?: number): Array<T[]> {
  const maxChunkSize = chunkSize ? Math.max(0, Number(chunkSize)) : 10;
  const chunks = [];
  for (let i = 0; i < items.length; i += maxChunkSize) {
    chunks.push(items.slice(i, maxChunkSize + i));
  }

  return chunks;
}
