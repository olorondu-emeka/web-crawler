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
