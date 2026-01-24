import { useState, useMemo } from "react";
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
import { Filter, ShoppingCart } from "lucide-react";
import { useStore } from "@/app/store/useStore";
import { useProducts } from "@/app/hooks/useProducts";
import type { Product } from "@/app/store/useStore";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { toast } from "sonner";
import { getImageUrl } from "@/utils/supabase/client";

interface ProductListProps {
  category?: "machines" | "beans" | "accessories" | "ingredients" | "all";
  searchQuery?: string;
  onNavigate: (view: string) => void;
}

export function ProductList({
  category = "all",
  searchQuery = "",
  onNavigate,
}: ProductListProps) {
  // Use React Query hook instead of local store
  const { data: products = [] } = useProducts(category);

  const addToCart = useStore((state) => state.addToCart);
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Category filter is already handled by useProducts query, but we might need clientside filter if 'all' was fetched
    if (category !== "all") {
      filtered = filtered.filter((p) => p.category === category);
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
      case "name":
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [products, category, searchQuery, priceFilter, sortBy]);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const getCategoryTitle = () => {
    switch (category) {
      case "machines":
        return "Coffee Machines";
      case "beans":
        return "Coffee Beans";
      case "accessories":
        return "Accessories";
      case "ingredients":
        return "Ingredients";
      default:
        return "All Products";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl mb-2">{getCategoryTitle()}</h1>
          <p className="text-gray-600">
            {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""} found
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
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">No products found</p>
            <Button onClick={() => onNavigate("products")} variant="outline">
              View All Products
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="group cursor-pointer hover:shadow-xl transition-all"
                onClick={() => onNavigate(`product-${product.id}`)}
              >
                <CardContent className="p-0">
                  <div className="aspect-square overflow-hidden bg-gray-100 relative">
                    <ImageWithFallback
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
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
                      className="mb-2 text-amber-700 border-amber-700"
                    >
                      {product.category}
                    </Badge>
                    <h3 className="font-semibold mb-2 line-clamp-2 min-h-[3rem]">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {product.description}
                    </p>

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
                      <p className="text-xl font-bold text-amber-900">
                        ${product.price.toFixed(2)}
                      </p>
                      <Button
                        size="sm"
                        onClick={(e) => handleAddToCart(product, e)}
                        disabled={product.stock === 0}
                        className="bg-amber-700 hover:bg-amber-800"
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
