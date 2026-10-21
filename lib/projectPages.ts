// Routing helpers for the per-project case-study pages (/projects/<slug>).

export function projectSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Projects that have a full case-study page, in their carousel order.
export function pagedProjects<T extends { page?: unknown }>(projects: T[]): T[] {
  return projects.filter((p) => p.page !== undefined);
}

// The previous and next page around `slug`, wrapping at the ends. Null when there's only one page.
export function neighbours<T extends { name: string }>(pages: T[], slug: string): [T | null, T | null] {
  const i = pages.findIndex((p) => projectSlug(p.name) === slug);
  if (i === -1 || pages.length < 2) return [null, null];
  const n = pages.length;
  return [pages[(i - 1 + n) % n], pages[(i + 1) % n]];
}
