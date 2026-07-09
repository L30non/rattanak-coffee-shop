// SEO helpers: site URL resolution + JSON-LD builders.
// JSON-LD builders are fleshed out in Phase 4 (metadata/sitemap/structured data);
// this file currently exposes the URL helpers other Phase 1-3 modules depend on.

export function siteUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL;
  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_APP_URL environment variable.");
  }
  return url.replace(/\/$/, "");
}

export function absoluteUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl()}${normalizedPath}`;
}
