import type { ComponentType } from "react";
import {
  Bean,
  Coffee,
  Milk,
  Settings,
  ShoppingBag,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { motion, MotionConfig } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { useMultipleProducts } from "@/app/hooks/useProducts";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { getImageUrl } from "@/utils/supabase/client";
import {
  CATEGORIES,
  categoryLabel,
  type CategoryValue,
} from "@/lib/categories";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";

// Shown on a category card only when no product in it has a photo yet.
const CATEGORY_ICONS: Record<CategoryValue, ComponentType<{ className?: string }>> = {
  machines: Coffee,
  beans: Bean,
  accessories: Wrench,
  ingredients: Milk,
};

interface HomePageProps {
  onNavigate: (view: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { t } = useI18n();

  const { data: products = [], isLoading, error } = useMultipleProducts();

  const featuredProducts = products.slice(0, 4);

  // Each category card shows a real product photo from that category, so the
  // grid reads as the catalogue rather than as decoration.
  const categoryStats = (value: CategoryValue) => {
    const inCategory = products.filter((p) => p.category === value);
    return {
      count: inCategory.length,
      image: inCategory.find((p) => p.image)?.image,
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-tint to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-brand-deep text-white min-h-[560px] md:min-h-[640px] flex items-end">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://qboxqdnuoqpsrmqtaaaf.supabase.co/storage/v1/object/public/Images/branding/brownroaster.jpg"
            alt={t("Coffee background")}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Darkens only behind the text (bottom on mobile, left on desktop)
              so the roastery photo stays visible. */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/95 via-brand-deep/60 to-brand-deep/20 md:bg-gradient-to-r md:from-brand-deep/90 md:via-brand-deep/65 md:to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-4 pt-32 pb-16 md:pb-20">
          {/* The page's one entrance animation; skipped under reduced motion. */}
          <MotionConfig reducedMotion="user">
            <motion.div
              className="max-w-3xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
            <h1 className="text-6xl md:text-8xl leading-[0.95] mb-6">
              {t("Roasting coffee in Cambodia since 1997.")}
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-xl text-brand-soft">
              {t("Made locally, distributed globally — Rattanak Coffee is your trusted source and one of Cambodia's leading suppliers for everything coffee, from beans to machines to business consulting.")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={() => onNavigate("products")}
                className="bg-white text-brand-deep hover:bg-brand-tint"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                {t("Shop Now")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate("beans")}
                className="border-white text-white bg-brand/50 hover:bg-white hover:text-brand-deep hover:border-brand-deep"
              >
                {t("Explore Beans")}
              </Button>
            </div>
            </motion.div>
          </MotionConfig>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Card className="border-none shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-brand-tint p-3 rounded-full">
                      <Coffee className="h-6 w-6 text-brand" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        {t("Coffee Beans")}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {t("Sourced from the hills of Cambodia to specialty blends from across the globe, we craft coffee for every palate.")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="border-none shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-brand-tint p-3 rounded-full">
                      <Settings className="h-6 w-6 text-brand" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        {t("Coffee Machines")}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {t("Your one-stop shop for every coffee machine and accessory — tell us what you need and we'll find the perfect choice.")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="border-none shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-brand-tint p-3 rounded-full">
                      <TrendingUp className="h-6 w-6 text-brand" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        {t("Coffee Business")}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {t("Dream of starting your own café? Consult with us and launch your coffee brand for as low as $3,000.")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">{t("Featured Products")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("Explore our handpicked selection of premium coffee products")}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
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
                </div>
              ))
            ) : error ? (
              <div className="col-span-full text-center py-12">
                <p className="text-red-600">
                  {t("Failed to load products. Please try again later.")}
                </p>
              </div>
            ) : featuredProducts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">
                  {t("No products available at the moment.")}
                </p>
              </div>
            ) : (
              featuredProducts.map((product) => (
                <div key={product.id}>
                  <Card
                    className="h-full cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => onNavigate(`product-${product.id}`)}
                  >
                    <CardContent className="p-0">
                      <div className="aspect-square overflow-hidden bg-white relative">
                        <ImageWithFallback
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          fill
                          objectFit="contain"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-contain"
                        />
                      </div>
                      <div className="p-3 sm:p-4">
                        <p className="text-sm text-brand mb-1">
                          {t(categoryLabel(product.category))}
                        </p>
                        <h3 className="font-semibold mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-lg font-bold text-brand-deep">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={() => onNavigate("products")}
              className="bg-brand hover:bg-brand-dark"
            >
              {t("View All Products")}
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-brand-tint">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">{t("Shop by Category")}</h2>
            <p className="text-gray-600">
              {t("Everything you need for the perfect coffee experience")}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {CATEGORIES.map((category) => {
              const { count, image } = categoryStats(category.value);
              const Icon = CATEGORY_ICONS[category.value];
              return (
                <Card
                  key={category.value}
                  className="cursor-pointer overflow-hidden hover:shadow-lg transition-shadow group"
                  onClick={() => onNavigate(category.value)}
                >
                  <CardContent className="p-0">
                    <div className="aspect-[4/3] relative bg-white">
                      {image ? (
                        <ImageWithFallback
                          src={getImageUrl(image)}
                          alt=""
                          fill
                          objectFit="contain"
                          sizes="(max-width: 1024px) 50vw, 25vw"
                          className="object-contain p-4"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-brand-tint">
                          <Icon className="h-12 w-12 text-brand/60" />
                        </div>
                      )}
                    </div>
                    <div className="p-3 sm:p-5 border-t">
                      <h3 className="font-semibold text-lg sm:text-xl group-hover:text-brand transition-colors">
                        {t(category.label)}
                      </h3>
                      {!isLoading && (
                        <p className="text-sm text-gray-600">
                          {count === 0
                            ? t("Coming soon")
                            : count === 1
                              ? t("1 product")
                              : t("{count} products", { count })}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand-dark to-brand text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl mb-6">
            {t("Ready to Start Your Coffee Journey?")}
          </h2>
          <p className="text-xl mb-8 text-brand-soft max-w-2xl mx-auto">
            {t("Join thousands of coffee enthusiasts who trust us for their daily brew")}
          </p>
          <Button
            size="lg"
            onClick={() => onNavigate("products")}
            className="bg-white text-brand-deep hover:bg-brand-tint"
          >
            {t("Start Shopping")}
          </Button>
        </div>
      </section>
    </div>
  );
}
