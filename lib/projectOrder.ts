export function featuredFirst<T extends { featured?: boolean }>(items: T[]): T[] {
  return [...items.filter((i) => i.featured), ...items.filter((i) => !i.featured)];
}
