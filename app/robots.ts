import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { viewToHref } from "@/lib/routes";

export default function robots(): MetadataRoute.Robots {
  // Keep account/checkout flows out of the index — mirrors the noindex meta
  // set on these same views in lib/seo.ts.
  const disallow = [
    "cart",
    "checkout",
    "login",
    "account",
    "profile",
    "admin",
    "address",
    "settings",
  ].map((view) => viewToHref(view));

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", ...disallow],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
