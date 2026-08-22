import type { Metadata } from "next";
import {
  CATEGORIES,
  getCategory,
  getSubcategory,
  parseCatalogView,
} from "@/lib/categories";
import { getProduct } from "@/lib/products";
import { viewToHref } from "@/lib/routes";
import { getImageUrl } from "@/utils/supabase/client";

export const SITE_URL = "https://www.rattanakcoffee.com";
export const SITE_NAME = "Rattanak Coffee Shop";
export const SITE_DESCRIPTION =
  "Rattanak Coffee — premium coffee beans, machines, and accessories from Cambodia. Roasting quality Robusta and Arabica in-house since 1997.";

// Views that are per-user or transactional rather than content, e.g. cart or
// account settings. They have nothing to offer a search result and nothing
// for Google to distinguish from every other visitor's page, so they're kept
// out of the index entirely (paired with the disallow list in app/robots.ts).
const NON_INDEXABLE_VIEWS = new Set([
  "cart",
  "checkout",
  "login",
  "account",
  "profile",
  "admin",
  "address",
  "settings",
]);

const STATIC_VIEW_METADATA: Record<string, { title: string; description: string }> = {
  products: {
    title: "Shop All Products",
    description:
      "Browse coffee machines, roasted and green beans, brewing accessories, and ingredients from Rattanak Coffee.",
  },
  about: {
    title: "About Us",
    description:
      "Rattanak Coffee offers more than just coffee — since 1997, we've been committed to consistency, genuine taste, and quality in every cup.",
  },
  business: {
    title: "Start a Coffee Business",
    description:
      "Product, service, and consulting — everything you need to brew a lucrative coffee business with Rattanak Coffee.",
  },
  gallery: {
    title: "Gallery",
    description:
      "A look at Rattanak Coffee — from barista training to our in-house roastery.",
  },
  contact: {
    title: "Contact Us",
    description:
      "Have questions about our products or need help starting your cafe? Get in touch with Rattanak Coffee.",
  },
  terms: {
    title: "Terms of Service",
    description: "The terms of service for shopping with Rattanak Coffee.",
  },
  privacy: {
    title: "Privacy Policy",
    description: "How Rattanak Coffee collects, uses, and protects your data.",
  },
  refund: {
    title: "Refund Policy",
    description: "Rattanak Coffee's return and refund policy.",
  },
};

/** All indexable category/subcategory view strings, e.g. "beans", "beans/roasted". */
export function allCatalogViews(): string[] {
  return CATEGORIES.flatMap((category) => [
    category.value,
    ...category.subcategories.map((sub) => `${category.value}/${sub.value}`),
  ]);
}

/** All static marketing view strings that should be indexed. */
export function allStaticIndexableViews(): string[] {
  return ["home", ...Object.keys(STATIC_VIEW_METADATA)];
}

/**
 * Builds page metadata for a `currentView` string (see app/App.tsx). Mirrors
 * the same view parsing App.tsx's renderView() does, so every URL the SPA can
 * reach gets a distinct, accurate title/description instead of the one
 * generic pair every route previously inherited from the root layout —
 * without that, Google has no way to tell pages apart and won't offer them
 * as sitelinks.
 */
export async function buildMetadataForView(view: string): Promise<Metadata> {
  const canonical = `${SITE_URL}${viewToHref(view)}`;

  if (NON_INDEXABLE_VIEWS.has(view)) {
    return { robots: { index: false, follow: false } };
  }

  if (view.startsWith("product-")) {
    const id = view.slice("product-".length);
    const product = await getProduct(id);
    if (!product) {
      return { title: "Product Not Found", robots: { index: false, follow: false } };
    }
    const description = (
      product.description?.trim() || `${product.name} from Rattanak Coffee.`
    ).slice(0, 155);
    const image = getImageUrl(product.image);
    return {
      title: product.name,
      description,
      alternates: { canonical },
      openGraph: {
        title: product.name,
        description,
        url: canonical,
        images: image ? [image] : undefined,
      },
      twitter: {
        card: "summary",
        title: product.name,
        description,
        images: image ? [image] : undefined,
      },
    };
  }

  const catalog = parseCatalogView(view);
  if (catalog) {
    const category = getCategory(catalog.category);
    const subcategory = catalog.subcategory
      ? getSubcategory(catalog.category, catalog.subcategory)
      : undefined;
    const title = subcategory?.title ?? category?.title ?? "Products";
    const description =
      subcategory?.description ?? category?.description ?? SITE_DESCRIPTION;
    return {
      title,
      description,
      alternates: { canonical },
      openGraph: { title, description, url: canonical },
      twitter: { card: "summary", title, description },
    };
  }

  if (view === "home") {
    return { alternates: { canonical } };
  }

  const entry = STATIC_VIEW_METADATA[view];
  if (entry) {
    return {
      ...entry,
      alternates: { canonical },
      openGraph: { title: entry.title, description: entry.description, url: canonical },
      twitter: { card: "summary", title: entry.title, description: entry.description },
    };
  }

  // Unknown view: App.tsx's renderView() falls back to HomePage, so match
  // that instead of indexing a page that renders content unrelated to its URL.
  return { robots: { index: false, follow: false } };
}

interface BreadcrumbSegment {
  name: string;
  href: string;
}

/** JSON-LD BreadcrumbList for a category/subcategory or product page. */
export function breadcrumbJsonLd(segments: BreadcrumbSegment[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: segments.map((segment, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: segment.name,
      item: `${SITE_URL}${segment.href}`,
    })),
  };
}

/** JSON-LD Product schema for a product detail page. */
export function productJsonLd(product: {
  id: string;
  name: string;
  description: string;
  image: string | null;
  price: number;
  stock: number;
}) {
  const image = getImageUrl(product.image);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: image ? [image] : undefined,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product/${product.id}`,
      priceCurrency: "USD",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };
}
