// Transitional map from the legacy `currentView` strings (app/App.tsx) to
// real URLs. Used while migrating onNavigate-prop components to next/link —
// delete once every component navigates via Link/router directly.

import { parseCatalogView } from "@/lib/categories";

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
