export function withSrc<T extends { src?: string }>(items: T[], limit: number): T[] {
  return items.filter((i) => Boolean(i.src)).slice(0, limit);
}
