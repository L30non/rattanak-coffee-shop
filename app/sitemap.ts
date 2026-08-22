import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/products";
import { viewToHref } from "@/lib/routes";
import { allCatalogViews, allStaticIndexableViews, SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = allStaticIndexableViews().map(
    (view) => ({
      url: `${SITE_URL}${viewToHref(view)}`,
      changeFrequency: view === "home" ? "daily" : "monthly",
      priority: view === "home" ? 1 : 0.6,
    }),
  );

  const catalogEntries: MetadataRoute.Sitemap = allCatalogViews().map(
    (view) => ({
      url: `${SITE_URL}${viewToHref(view)}`,
      changeFrequency: "weekly",
      priority: 0.7,
    }),
  );

  const products = await getProducts();
  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/product/${product.id}`,
    lastModified: product.updated_at ? new Date(product.updated_at) : undefined,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...catalogEntries, ...productEntries];
}
