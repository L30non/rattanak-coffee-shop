import { Coffee, ShoppingBag, Star, TrendingUp } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { useProducts } from "@/app/hooks/useProducts";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { getImageUrl } from "@/utils/supabase/client";

interface HomePageProps {
  onNavigate: (view: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { data: products = [] } = useProducts();

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-amber-900 to-amber-700 text-white">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl mb-6">
              Premium Coffee
              <br />
              <span className="text-amber-200">For Every Moment</span>
            </h1>
            <p className="text-xl mb-8 text-amber-100">
              Discover the finest coffee beans, machines, and accessories for
              the perfect brew. From bean to cup, we have got everything you
              need.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={() => onNavigate("products")}
                className="bg-white text-amber-900 hover:bg-amber-50"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate("beans")}
                className="border-white text-white bg-amber-800/50 hover:bg-white hover:text-amber-900 hover:border-amber-900"
              >
                Explore Beans
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 opacity-10">
          <Coffee className="h-96 w-96" />
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="bg-amber-100 p-3 rounded-full">
                    <Coffee className="h-6 w-6 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      Premium Quality
                    </h3>
                    <p className="text-sm text-gray-600">
                      Sourced from the finest coffee regions worldwide
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="bg-amber-100 p-3 rounded-full">
                    <Star className="h-6 w-6 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      Expert Selection
                    </h3>
                    <p className="text-sm text-gray-600">
                      Curated by coffee professionals and enthusiasts
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="bg-amber-100 p-3 rounded-full">
                    <TrendingUp className="h-6 w-6 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      Fresh Roasted
                    </h3>
                    <p className="text-sm text-gray-600">
                      Beans roasted to order for maximum freshness
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our handpicked selection of premium coffee products
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="group cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onNavigate(`product-${product.id}`)}
              >
                <CardContent className="p-0">
                  <div className="aspect-square overflow-hidden bg-gray-100 relative">
                    <ImageWithFallback
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-amber-700 uppercase tracking-wide mb-1">
                      {product.category}
                    </p>
                    <h3 className="font-semibold mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-lg font-bold text-amber-900">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={() => onNavigate("products")}
              className="bg-amber-700 hover:bg-amber-800"
            >
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">Shop by Category</h2>
            <p className="text-gray-600">
              Everything you need for the perfect coffee experience
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Machines", view: "machines", icon: "☕" },
              { name: "Coffee Beans", view: "beans", icon: "🫘" },
              { name: "Accessories", view: "accessories", icon: "🔧" },
              { name: "Ingredients", view: "ingredients", icon: "🍯" },
            ].map((category) => (
              <Card
                key={category.view}
                className="cursor-pointer hover:shadow-lg transition-shadow group"
                onClick={() => onNavigate(category.view)}
              >
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-4">{category.icon}</div>
                  <h3 className="font-semibold text-xl group-hover:text-amber-700 transition-colors">
                    {category.name}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-800 to-amber-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl mb-6">
            Ready to Start Your Coffee Journey?
          </h2>
          <p className="text-xl mb-8 text-amber-100 max-w-2xl mx-auto">
            Join thousands of coffee enthusiasts who trust us for their daily
            brew
          </p>
          <Button
            size="lg"
            onClick={() => onNavigate("products")}
            className="bg-white text-amber-900 hover:bg-amber-50"
          >
            Start Shopping
          </Button>
        </div>
      </section>
    </div>
  );
}
