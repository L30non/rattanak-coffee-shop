import { useState } from "react";
import {
  ArrowLeft,
  ShoppingCart,
  Minus,
  Plus,
  Package,
  Truck,
  Shield,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { useStore } from "@/app/store/useStore";
import { useSingleProduct } from "@/app/hooks/useProducts";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { ProductReviews } from "@/app/components/ProductReviews";
import { getImageUrl } from "@/utils/supabase/client";
import { toast } from "sonner";

interface ProductDetailProps {
  productId: string;
  onNavigate: (view: string) => void;
}

export function ProductDetail({ productId, onNavigate }: ProductDetailProps) {
  const { data: product, isLoading } = useSingleProduct(productId);
  const addToCart = useStore((state) => state.addToCart);
  const [quantity, setQuantity] = useState(1);

  if (isLoading)
    return <div className="p-8 text-center">Loading product details...</div>;

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg text-gray-600 mb-4">Product not found</p>
          <Button onClick={() => onNavigate("products")}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} ${product.name} added to cart!`);
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((q) => q + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => onNavigate("products")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div>
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square bg-gray-100 relative">
                  <ImageWithFallback
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Info */}
          <div>
            <Badge
              variant="outline"
              className="mb-4 text-[#5F1B2C] border-[#5F1B2C]"
            >
              {product.category}
            </Badge>

            <h1 className="text-3xl md:text-4xl mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <p className="text-3xl font-bold text-[#3d1620]">
                ${product.price.toFixed(2)}
              </p>
              {product.stock > 0 ? (
                <Badge
                  variant="outline"
                  className="text-green-600 border-green-600"
                >
                  In Stock ({product.stock} available)
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-red-600 border-red-600"
                >
                  Out of Stock
                </Badge>
              )}
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Product Specifications */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Product Details</h3>
                <div className="space-y-2 text-sm">
                  {product.roast_level && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Roast Level:</span>
                      <span className="font-medium">{product.roast_level}</span>
                    </div>
                  )}
                  {product.origin && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Origin:</span>
                      <span className="font-medium">{product.origin}</span>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weight/Size:</span>
                      <span className="font-medium">{product.weight}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium capitalize">
                      {product.category}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-[#5F1B2C] rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-6 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              size="lg"
              className="w-full mb-6 bg-[#5F1B2C] hover:bg-[#4a1523]"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Package className="h-5 w-5 text-[#5F1B2C]" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-5 w-5 text-[#5F1B2C]" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-5 w-5 text-[#5F1B2C]" />
                <span>Secure Payment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Reviews Section */}
        <ProductReviews productId={productId} productName={product.name} />
      </div>
    </div>
  );
}
