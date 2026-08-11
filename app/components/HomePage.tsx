import { Coffee, ShoppingBag, Settings, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { useMultipleProducts } from "@/app/hooks/useProducts";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { getImageUrl } from "@/utils/supabase/client";

interface HomePageProps {
  onNavigate: (view: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { data: products = [], isLoading, error } = useMultipleProducts();

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#3d1620] to-[#5F1B2C] text-white min-h-[600px]">
        {/* Background Image Placeholder - Replace with Supabase image URL */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://qboxqdnuoqpsrmqtaaaf.supabase.co/storage/v1/object/public/Images/branding/brownroaster.jpg"
            alt="Coffee background"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#3d1620]/90 to-[#5F1B2C]/80" />
        </div>

        <div className="container relative z-10 mx-auto px-4 py-24">
          <div className="max-w-3xl">
            <p className="uppercase tracking-widest text-sm text-rose-200 mb-3">
              Roasting greatness since 1997
            </p>
            <h1 className="text-5xl md:text-6xl mb-6">
              Roasting coffee
              <br />
              <span className="text-rose-200">with passion and expertise.</span>
            </h1>
            <p className="text-xl mb-8 text-rose-100">
              Made locally, distributed globally — Rattanak Coffee is your
              trusted source and one of Cambodia&apos;s leading suppliers for
              everything coffee, from beans to machines to business
              consulting.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={() => onNavigate("products")}
                className="bg-white text-[#3d1620] hover:bg-rose-50"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate("beans")}
                className="border-white text-white bg-[#5F1B2C]/50 hover:bg-white hover:text-[#3d1620] hover:border-[#3d1620]"
              >
                Explore Beans
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2 },
              },
            }}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Card className="border-none shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-rose-50 p-3 rounded-full">
                      <Coffee className="h-6 w-6 text-[#5F1B2C]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        Coffee Beans
                      </h3>
                      <p className="text-sm text-gray-600">
                        Sourced from the hills of Cambodia to specialty
                        blends from across the globe, we craft coffee for
                        every palate.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Card className="border-none shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-rose-50 p-3 rounded-full">
                      <Settings className="h-6 w-6 text-[#5F1B2C]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        Coffee Machines
                      </h3>
                      <p className="text-sm text-gray-600">
                        Your one-stop shop for every coffee machine and
                        accessory — tell us what you need and we&apos;ll
                        find the perfect choice.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Card className="border-none shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-rose-50 p-3 rounded-full">
                      <TrendingUp className="h-6 w-6 text-[#5F1B2C]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        Coffee Business
                      </h3>
                      <p className="text-sm text-gray-600">
                        Dream of starting your own café? Consult with us and
                        launch your coffee brand for as low as $3,000.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
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

          <motion.div
            key={isLoading ? "loading" : "loaded"}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.2 },
              },
            }}
          >
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <motion.div
                  key={`skeleton-${index}`}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Card className="animate-pulse">
                    <CardContent className="p-0">
                      <div className="aspect-square bg-gray-200" />
                      <div className="p-4 space-y-3">
                        <div className="h-3 bg-gray-200 rounded w-1/4" />
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-5 bg-gray-200 rounded w-1/3" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : error ? (
              <div className="col-span-full text-center py-12">
                <p className="text-red-600">
                  Failed to load products. Please try again later.
                </p>
              </div>
            ) : featuredProducts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">
                  No products available at the moment.
                </p>
              </div>
            ) : (
              featuredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Card
                    className="group cursor-pointer hover:shadow-lg transition-shadow"
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
                          className="object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-[#5F1B2C] uppercase tracking-wide mb-1">
                          {product.category}
                        </p>
                        <h3 className="font-semibold mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-lg font-bold text-[#3d1620]">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={() => onNavigate("products")}
              className="bg-[#5F1B2C] hover:bg-[#4a1523]"
            >
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-rose-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">Shop by Category</h2>
            <p className="text-gray-600">
              Everything you need for the perfect coffee experience
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15 },
              },
            }}
          >
            {[
              { name: "Machines", view: "machines", icon: "☕" },
              { name: "Coffee Beans", view: "beans", icon: "🫘" },
              { name: "Accessories", view: "accessories", icon: "🔧" },
              { name: "Ingredients", view: "ingredients", icon: "🍯" },
            ].map((category) => (
              <motion.div
                key={category.view}
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  visible: { opacity: 1, scale: 1 },
                }}
                whileHover={{ y: -8, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-lg transition-shadow group"
                  onClick={() => onNavigate(category.view)}
                >
                  <CardContent className="p-8 text-center">
                    <div className="text-6xl mb-4">{category.icon}</div>
                    <h3 className="font-semibold text-xl group-hover:text-[#5F1B2C] transition-colors">
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#4a1523] to-[#5F1B2C] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl mb-6">
            Ready to Start Your Coffee Journey?
          </h2>
          <p className="text-xl mb-8 text-rose-100 max-w-2xl mx-auto">
            Join thousands of coffee enthusiasts who trust us for their daily
            brew
          </p>
          <Button
            size="lg"
            onClick={() => onNavigate("products")}
            className="bg-white text-[#3d1620] hover:bg-rose-50"
          >
            Start Shopping
          </Button>
        </div>
      </section>
    </div>
  );
}
