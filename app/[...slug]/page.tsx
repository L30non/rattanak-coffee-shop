import type { Metadata } from "next";
import App from "@/app/App";
import { getProduct } from "@/lib/products";
import { getCategory, getSubcategory, parseCatalogView } from "@/lib/categories";
import { hrefToView } from "@/lib/routes";
import { breadcrumbJsonLd, buildMetadataForView, productJsonLd } from "@/lib/seo";

/**
 * The site is a single-page app driven by App.tsx's internal `currentView`
 * state, not by file-based routes — every "page" here renders the same shell.
 * This catch-all exists so a hard refresh (or a shared link) on a deep URL
 * like /cart or /product/<id> hits a real route instead of 404ing, then hands
 * the resolved view to App as its first-paint state.
 */

interface CatchAllProps {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ search?: string }>;
}

function resolveView(slug: string[] | undefined): string {
  return hrefToView(`/${(slug ?? []).join("/")}`);
}

export async function generateMetadata({
  params,
}: CatchAllProps): Promise<Metadata> {
  const { slug } = await params;
  return buildMetadataForView(resolveView(slug));
}

export default async function CatchAllPage({ params, searchParams }: CatchAllProps) {
  const { slug } = await params;
  const { search } = await searchParams;
  const initialView = resolveView(slug);

  return (
    <>
      <StructuredData view={initialView} />
      <App initialView={initialView} initialSearchQuery={search} />
    </>
  );
}

/** Renders Product / BreadcrumbList JSON-LD for views that warrant it. */
async function StructuredData({ view }: { view: string }) {
  if (view.startsWith("product-")) {
    const id = view.slice("product-".length);
    const product = await getProduct(id);
    if (!product) return null;
    const category = getCategory(product.category);
    const subcategory = product.subcategory
      ? getSubcategory(product.category, product.subcategory)
      : undefined;
    const breadcrumb = breadcrumbJsonLd([
      { name: "Products", href: "/products" },
      {
        name: category?.label ?? product.category,
        href: `/products/${product.category}`,
      },
      ...(subcategory
        ? [
            {
              name: subcategory.label,
              href: `/products/${product.category}/${product.subcategory}`,
            },
          ]
        : []),
      { name: product.name, href: `/product/${product.id}` },
    ]);
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
        />
      </>
    );
  }

  const catalog = parseCatalogView(view);
  if (catalog) {
    const category = getCategory(catalog.category);
    const subcategory = catalog.subcategory
      ? getSubcategory(catalog.category, catalog.subcategory)
      : undefined;
    const segments = [
      { name: "Products", href: "/products" },
      { name: category?.label ?? catalog.category, href: `/products/${catalog.category}` },
    ];
    if (subcategory) {
      segments.push({
        name: subcategory.label,
        href: `/products/${catalog.category}/${catalog.subcategory}`,
      });
    }
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(segments)) }}
      />
    );
  }

  return null;
}
