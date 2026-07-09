// Transitional map from the legacy `currentView` strings (app/App.tsx) to
// real URLs. Used while migrating onNavigate-prop components to next/link —
// delete once every component navigates via Link/router directly.

const PRODUCT_CATEGORIES = new Set([
  "machines",
  "beans",
  "accessories",
  "ingredients",
]);

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
  blog: "/blog",
  gallery: "/gallery",
  contact: "/contact",
};

export function viewToHref(view: string): string {
  if (view.startsWith("product-")) {
    return `/product/${view.replace("product-", "")}`;
  }
  if (PRODUCT_CATEGORIES.has(view)) {
    return `/products/${view}`;
  }
  return STATIC_VIEW_ROUTES[view] ?? "/";
}
