import { useState, useEffect, useMemo } from "react";
import { Search, Loader2, Package } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/app/components/ui/command";
import { Badge } from "@/app/components/ui/badge";
import { getImageUrl } from "@/utils/supabase/client";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import type { Product } from "@/app/store/useStore";

interface ProductSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (productId: string) => void;
}

export function ProductSearchDialog({
  open,
  onOpenChange,
  onNavigate,
}: ProductSearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  // TODO: Implement search functionality
  const products = useMemo<Product[]>(() => [], []);
  const isLoading = false;
  const error: Error | null = null;

  // Reset search when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSearchQuery("");
    }
    onOpenChange(newOpen);
  };

  // Debug logs
  useEffect(() => {
    if (searchQuery.length >= 2) {
      console.log("Searching for:", searchQuery);
      console.log("Results:", products);
      console.log("Loading:", isLoading);
      console.log("Error:", error);
    }
  }, [searchQuery, products, isLoading, error]);

  // Add keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(true);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [onOpenChange]);

  const handleSelectProduct = (productId: string) => {
    onNavigate(`product-${productId}`);
    onOpenChange(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <CommandDialog open={open} onOpenChange={handleOpenChange}>
      <CommandInput
        placeholder="Search products by name, category, or description..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        {isLoading && searchQuery.length >= 2 && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        )}

        {error && searchQuery.length >= 2 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-sm text-red-500 mb-2">Error loading results</p>
            <p className="text-xs text-gray-400">
              Unable to load search results
            </p>
          </div>
        )}

        {!isLoading && !error && searchQuery.length < 2 && (
          <CommandEmpty>
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Search className="h-8 w-8 text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">
                Type at least 2 characters to search
              </p>
            </div>
          </CommandEmpty>
        )}

        {!isLoading &&
          !error &&
          searchQuery.length >= 2 &&
          products.length === 0 && (
            <CommandEmpty>
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Package className="h-8 w-8 text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No products found</p>
                <p className="text-xs text-gray-400 mt-1">
                  Try different keywords
                </p>
              </div>
            </CommandEmpty>
          )}

        {products.length > 0 && (
          <CommandGroup heading="Products">
            {products.map((product) => (
              <CommandItem
                key={product.id}
                value={product.id}
                onSelect={() => handleSelectProduct(product.id)}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-3 w-full">
                  {/* Product Image */}
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    <ImageWithFallback
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">
                        {product.name}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {product.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="font-semibold text-[#5F1B2C]">
                        {formatPrice(product.price)}
                      </span>
                      {product.average_rating && product.average_rating > 0 && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            ⭐ {product.average_rating.toFixed(1)}
                            {product.review_count && (
                              <span className="text-gray-400">
                                ({product.review_count})
                              </span>
                            )}
                          </span>
                        </>
                      )}
                      {product.stock !== undefined && (
                        <>
                          <span>•</span>
                          <span
                            className={
                              product.stock > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {product.stock > 0
                              ? `${product.stock} in stock`
                              : "Out of stock"}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
