export const domainFromUrl = (url: string) => {
  return new URL(url).hostname
}
