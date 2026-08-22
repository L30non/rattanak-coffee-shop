import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/app/components/ui/pagination";
import { Filter, ShoppingCart, Star } from "lucide-react";
import { useStore } from "@/app/store/useStore";
import { useMultipleProducts } from "@/app/hooks/useProducts";
import type { Product } from "@/app/store/useStore";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { toast } from "sonner";
import { getImageUrl } from "@/utils/supabase/client";
import { getCategory, type SubcategoryValue } from "@/lib/categories";
import {
  defaultVariant,
  formatVariant,
  getWeightOptions,
  lowestPrice,
  needsSelection,
  resolveUnitPrice,
} from "@/lib/beans";

interface ProductListProps {
  category?: "machines" | "beans" | "accessories" | "ingredients" | "all";
  subcategory?: SubcategoryValue;
  searchQuery?: string;
  onNavigate: (view: string) => void;
}

// 3 rows at the widest grid breakpoint (xl: 4 columns) — see the grid's
// className below. Narrower breakpoints just show more visual rows per page,
// which is the standard tradeoff for a fixed page size across a responsive
// grid rather than a page size that changes with viewport width.
const PRODUCTS_PER_PAGE = 12;

/** Page numbers to render, with `null` standing in for an ellipsis gap. */
function getPageNumbers(current: number, total: number): (number | null)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set([1, 2, total - 1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const result: (number | null)[] = [];
  let prev = 0;
  for (const page of sorted) {
    if (prev && page - prev > 1) result.push(null);
    result.push(page);
    prev = page;
  }
  return result;
}

export function ProductList({
  category = "all",
  subcategory,
  searchQuery = "",
  onNavigate,
}: ProductListProps) {
  // Use React Query hook instead of local store
  const { data: products = [], isLoading } = useMultipleProducts(
    category,
    subcategory,
  );

  const addToCart = useStore((state) => state.addToCart);
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [rawCurrentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Category filter is already handled by useProducts query, but we might need clientside filter if 'all' was fetched
    if (category !== "all") {
      filtered = filtered.filter((p) => p.category === category);
    }

    // Subcategory filter is already handled by useProducts query; mirror defensively
    if (subcategory) {
      filtered = filtered.filter((p) => p.subcategory === subcategory);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Price filter
    if (priceFilter !== "all") {
      switch (priceFilter) {
        case "under50":
          filtered = filtered.filter((p) => p.price < 50);
          break;
        case "50to100":
          filtered = filtered.filter((p) => p.price >= 50 && p.price < 100);
          break;
        case "100to500":
          filtered = filtered.filter((p) => p.price >= 100 && p.price < 500);
          break;
        case "over500":
          filtered = filtered.filter((p) => p.price >= 500);
          break;
      }
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered = [...filtered].sort(
          (a, b) => (b.average_rating || 0) - (a.average_rating || 0),
        );
        break;
      case "name":
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [products, category, subcategory, searchQuery, priceFilter, sortBy]);

  // A new filter/sort/category selection invalidates whatever page the user
  // was on — reset to page 1. Adjusting state during render (rather than in
  // an effect) per https://react.dev/learn/you-might-not-need-an-effect —
  // React re-renders immediately with the reset value, so there's no extra
  // frame where stale, filtered-out products are visible on a stale page.
  const filterSignature = `${category}|${subcategory ?? ""}|${searchQuery}|${priceFilter}|${sortBy}`;
  const [prevFilterSignature, setPrevFilterSignature] = useState(filterSignature);
  if (filterSignature !== prevFilterSignature) {
    setPrevFilterSignature(filterSignature);
    setCurrentPage(1);
  }

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE),
  );
  // Clamped rather than stored: if the result set shrinks out from under an
  // already-open later page, this settles back on the last valid page on its
  // own, with no separate effect needed to keep it in sync.
  const currentPage = Math.min(rawCurrentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    // With a real choice open (several weights or both grinds), send the
    // customer to the detail page rather than guessing for them.
    if (needsSelection(product)) {
      onNavigate(`product-${product.id}`);
      return;
    }
    const variant = defaultVariant(product);
    const unitPrice = resolveUnitPrice(product, variant);
    addToCart(product, 1, variant, unitPrice);
    const summary = formatVariant(variant);
    toast.success(
      `${product.name}${summary ? ` (${summary})` : ""} added to cart!`,
    );
  };

  const activeCategory = category !== "all" ? getCategory(category) : undefined;
  const activeSubcategory = subcategory
    ? activeCategory?.subcategories.find((s) => s.value === subcategory)
    : undefined;

  const getCategoryTitle = () => {
    return activeSubcategory?.title ?? activeCategory?.title ?? "All Products";
  };

  const getCategoryDescription = () => {
    return activeSubcategory?.description ?? activeCategory?.description ?? null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl mb-2">{getCategoryTitle()}</h1>
          {getCategoryDescription() && (
            <p className="text-gray-600 max-w-2xl mb-2">
              {getCategoryDescription()}
            </p>
          )}
          <p className="text-gray-600">
            {isLoading
              ? "Loading products…"
              : totalPages > 1
                ? `Showing ${(currentPage - 1) * PRODUCTS_PER_PAGE + 1}–${Math.min(currentPage * PRODUCTS_PER_PAGE, filteredProducts.length)} of ${filteredProducts.length} products`
                : `${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""} found`}
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under50">Under $50</SelectItem>
                  <SelectItem value="50to100">$50 - $100</SelectItem>
                  <SelectItem value="100to500">$100 - $500</SelectItem>
                  <SelectItem value="over500">Over $500</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="price-low">Price (Low to High)</SelectItem>
              <SelectItem value="price-high">Price (High to Low)</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        <motion.div
          key={isLoading ? "loading" : `page-${currentPage}`}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
          initial="hidden"
          animate="show"
        >
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 8 }).map((_, index) => (
              <motion.div
                key={`skeleton-${index}`}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <Card className="animate-pulse h-full">
                  <CardContent className="p-0">
                    <div className="aspect-square bg-gray-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-3 bg-gray-200 rounded w-1/4" />
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="h-5 bg-gray-200 rounded w-1/3" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No products found</p>
              <Button onClick={() => onNavigate("products")} variant="outline">
                View All Products
              </Button>
            </div>
          ) : (
            paginatedProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <Card
                  className="group cursor-pointer hover:shadow-xl transition-all h-full"
                  onClick={() => onNavigate(`product-${product.id}`)}
                >
                  <CardContent className="p-0">
                    <div className="aspect-square overflow-hidden bg-gray-100 relative">
                      <ImageWithFallback
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        fill
                        objectFit="contain"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                      {product.stock < 10 && product.stock > 0 && (
                        <Badge className="absolute top-2 right-2 bg-orange-500 z-10">
                          Low Stock
                        </Badge>
                      )}
                      {product.stock === 0 && (
                        <Badge className="absolute top-2 right-2 bg-red-500 z-10">
                          Out of Stock
                        </Badge>
                      )}
                    </div>

                    <div className="p-4">
                      <Badge
                        variant="outline"
                        className="mb-2 text-[#5F1B2C] border-[#5F1B2C]"
                      >
                        {product.category}
                      </Badge>
                      <h3 className="font-semibold mb-2 line-clamp-2 min-h-[3rem]">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {product.description}
                      </p>

                      {/* Rating */}
                      {product.average_rating && product.average_rating > 0 && (
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">
                            {product.average_rating.toFixed(1)}
                          </span>
                          {product.review_count && (
                            <span className="text-xs text-gray-500">
                              ({product.review_count})
                            </span>
                          )}
                        </div>
                      )}

                      {/* Additional Info */}
                      {product.roast_level && (
                        <p className="text-xs text-gray-500 mb-2">
                          Roast: {product.roast_level}
                        </p>
                      )}
                      {product.origin && (
                        <p className="text-xs text-gray-500 mb-2">
                          Origin: {product.origin}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-4">
                        <p className="text-xl font-bold text-[#3d1620]">
                          {getWeightOptions(product).length > 1 && (
                            <span className="text-xs font-normal text-gray-500 mr-1">
                              from
                            </span>
                          )}
                          ${lowestPrice(product).toFixed(2)}
                        </p>
                        <motion.div whileTap={{ scale: 0.95 }}>
                          <Button
                            size="sm"
                            onClick={(e) => handleAddToCart(product, e)}
                            disabled={product.stock === 0}
                            className="bg-[#5F1B2C] hover:bg-[#4a1523]"
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            {needsSelection(product) ? "Options" : "Add"}
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <Pagination className="mt-10">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  aria-disabled={currentPage === 1}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : undefined
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    goToPage(currentPage - 1);
                  }}
                />
              </PaginationItem>

              {getPageNumbers(currentPage, totalPages).map((page, index) =>
                page === null ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={page === currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        goToPage(page);
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  aria-disabled={currentPage === totalPages}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : undefined
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    goToPage(currentPage + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
