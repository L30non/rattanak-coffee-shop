// Transitional map from the legacy `currentView` strings (app/App.tsx) to
// real URLs. Used while migrating onNavigate-prop components to next/link —
// delete once every component navigates via Link/router directly.
//
// Also backs the browser history sync in App.tsx (back/forward + refresh
// persistence): every pushState uses viewToHref, and the reverse,
// hrefToView, resolves the current URL back to a `currentView` string.

import { catalogView, parseCatalogView } from "@/lib/categories";

const STATIC_VIEW_ROUTES: Record<string, string> = {
  home: "/",
  products: "/products",
  cart: "/cart",
  checkout: "/checkout",
  login: "/login",
  account: "/account",
  profile: "/profile",
  admin: "/admin",
  address: "/addresses",
  settings: "/settings",
  terms: "/terms",
  privacy: "/privacy",
  refund: "/refund",
  about: "/about",
  business: "/business",
  gallery: "/gallery",
  contact: "/contact",
};

export function viewToHref(view: string): string {
  if (view.startsWith("product-")) {
    return `/product/${view.replace("product-", "")}`;
  }
  const catalog = parseCatalogView(view);
  if (catalog) {
    return catalog.subcategory
      ? `/products/${catalog.category}/${catalog.subcategory}`
      : `/products/${catalog.category}`;
  }
  return STATIC_VIEW_ROUTES[view] ?? "/";
}

const VIEW_BY_PATH: Record<string, string> = Object.fromEntries(
  Object.entries(STATIC_VIEW_ROUTES).map(([view, path]) => [path, view]),
);

/** Inverse of {@link viewToHref}. Unrecognized paths fall back to "home". */
export function hrefToView(pathname: string): string {
  const segments = pathname.replace(/^\/+|\/+$/g, "").split("/");
  if (segments[0] === "") return "home";

  if (segments[0] === "product" && segments[1]) {
    return `product-${segments[1]}`;
  }

  if (segments[0] === "products") {
    if (segments.length === 1) return "products";
    const catalog = parseCatalogView(segments.slice(1).join("/"));
    return catalog ? catalogView(catalog.category, catalog.subcategory) : "products";
  }

  return VIEW_BY_PATH[`/${segments[0]}`] ?? "home";
}
