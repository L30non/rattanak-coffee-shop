import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ChevronRight,
  Search,
  Coffee,
  BookOpen,
  Lightbulb,
  TrendingUp,
} from "lucide-react";

interface BlogProps {
  onNavigate: (view: string) => void;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  content: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "How to Choose the Right Coffee Machine for Your Cafe",
    excerpt:
      "Starting a cafe? The coffee machine is your most important investment. Learn how to pick the right one based on your budget, volume, and style.",
    category: "Guide",
    date: "January 15, 2025",
    readTime: "5 min read",
    image:
      "https://amsvlqivarurifjhboef.supabase.co/storage/v1/object/public/Images/branding/brownroaster.jpg",
    content:
      "Choosing the right coffee machine is crucial for any cafe. Consider factors like daily volume, drink types, maintenance requirements, and budget. Semi-automatic machines offer control, while fully automatic machines ensure consistency. We recommend starting with a reliable dual-boiler machine for cafes serving 100-200 cups daily.",
  },
  {
    id: "2",
    title: "The Art of Coffee Roasting: From Green Beans to Perfect Cup",
    excerpt:
      "Discover the journey of coffee beans from raw green seeds to the aromatic roasted beans that create your favorite beverages.",
    category: "Education",
    date: "December 28, 2024",
    readTime: "7 min read",
    image:
      "https://amsvlqivarurifjhboef.supabase.co/storage/v1/object/public/Images/branding/brownroaster.jpg",
    content:
      "Coffee roasting is both a science and an art. The process involves carefully applying heat to green coffee beans, transforming them through chemical reactions that develop flavor, aroma, and color. At Rattanak Coffee, our master roasters monitor temperature profiles carefully to bring out the unique characteristics of each origin.",
  },
  {
    id: "3",
    title: "5 Essential Accessories Every Barista Needs",
    excerpt:
      "From precision scales to tampers, these are the must-have tools that will elevate your coffee-making game to professional level.",
    category: "Tips",
    date: "December 10, 2024",
    readTime: "4 min read",
    image:
      "https://amsvlqivarurifjhboef.supabase.co/storage/v1/object/public/Images/branding/brownroaster.jpg",
    content:
      "Every barista needs the right tools. A precision scale ensures consistent dosing, a quality tamper delivers even extraction, a good grinder unlocks flavor potential, a milk pitcher for latte art, and a knock box for efficient workflow. Invest in quality accessories and your drinks will improve dramatically.",
  },
  {
    id: "4",
    title: "Understanding Coffee Bean Origins: A World Tour",
    excerpt:
      "Take a journey through the world's finest coffee-growing regions and learn how geography shapes the flavors in your cup.",
    category: "Education",
    date: "November 20, 2024",
    readTime: "6 min read",
    image:
      "https://amsvlqivarurifjhboef.supabase.co/storage/v1/object/public/Images/branding/brownroaster.jpg",
    content:
      "Coffee grown in Ethiopia tends to be fruity and floral, while Colombian beans offer balanced sweetness. Brazilian coffees are nutty and chocolatey, and Indonesian beans are earthy and full-bodied. Understanding origins helps you select the right beans for your cafe's signature drinks.",
  },
  {
    id: "5",
    title: "Starting a Cafe in Cambodia: What You Need to Know",
    excerpt:
      "A comprehensive guide for aspiring cafe owners in Cambodia, covering licensing, equipment, location, and building a loyal customer base.",
    category: "Business",
    date: "November 5, 2024",
    readTime: "8 min read",
    image:
      "https://amsvlqivarurifjhboef.supabase.co/storage/v1/object/public/Images/branding/brownroaster.jpg",
    content:
      "Cambodia's cafe scene is booming. To start your own cafe, focus on finding the right location with foot traffic, invest in quality equipment, source fresh local and imported beans, and create a welcoming atmosphere. Rattanak Coffee can supply everything you need from machines to beans to training.",
  },
  {
    id: "6",
    title: "The Perfect Espresso: A Step-by-Step Guide",
    excerpt:
      "Master the fundamentals of pulling a perfect espresso shot with this detailed guide covering grind size, dose, timing, and technique.",
    category: "Guide",
    date: "October 18, 2024",
    readTime: "5 min read",
    image:
      "https://amsvlqivarurifjhboef.supabase.co/storage/v1/object/public/Images/branding/brownroaster.jpg",
    content:
      "The perfect espresso starts with freshly ground beans at the right size. Use 18-20g of coffee, tamp evenly with 30 pounds of pressure, and aim for a 25-30 second extraction yielding 36-40ml. The result should be a rich, caramel-colored shot with a thick crema on top.",
  },
];

const categories = ["All", "Guide", "Education", "Tips", "Business"];

const categoryIcons: Record<string, typeof Coffee> = {
  Guide: BookOpen,
  Education: Lightbulb,
  Tips: TrendingUp,
  Business: Coffee,
};

export function Blog({ onNavigate }: BlogProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#3d1620] to-[#5F1B2C] text-white py-16">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => onNavigate("home")}
            className="mb-6 text-white hover:text-rose-200 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Blog</h1>
            <p className="text-xl text-rose-100 max-w-2xl">
              Tips, guides, and insights from our coffee experts to help you
              brew better and build a thriving cafe business.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5F1B2C]"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-[#5F1B2C] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <Coffee className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No articles found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter to find what you&apos;re
                looking for.
              </p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 },
                },
              }}
            >
              {filteredPosts.map((post) => {
                const IconComponent = categoryIcons[post.category] || Coffee;
                return (
                  <motion.div
                    key={post.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="h-full border-none shadow-md hover:shadow-xl transition-shadow overflow-hidden">
                      <div className="aspect-video relative overflow-hidden bg-gray-100">
                        <ImageWithFallback
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-[#5F1B2C] text-white">
                            <IconComponent className="h-3 w-3 mr-1" />
                            {post.category}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-5">
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {post.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.readTime}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-[#3d1620]">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>

                        {expandedPost === post.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-4"
                          >
                            <Separator className="mb-4" />
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {post.content}
                            </p>
                          </motion.div>
                        )}

                        <button
                          onClick={() =>
                            setExpandedPost(
                              expandedPost === post.id ? null : post.id,
                            )
                          }
                          className="text-[#5F1B2C] text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
                        >
                          {expandedPost === post.id
                            ? "Show Less"
                            : "Read More"}
                          <ChevronRight
                            className={`h-4 w-4 transition-transform ${expandedPost === post.id ? "rotate-90" : ""}`}
                          />
                        </button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gradient-to-r from-[#4a1523] to-[#5F1B2C] text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Stay Updated with Coffee Tips
            </h2>
            <p className="text-rose-100 mb-8 max-w-xl mx-auto">
              Follow us on social media for the latest articles, coffee tips,
              and product updates.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://www.facebook.com/rattanakcoffeeroaster"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-white text-[#3d1620] hover:bg-rose-50"
                >
                  Follow on Facebook
                </Button>
              </a>
              <a
                href="https://t.me/rattanakcoffee"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white bg-white/10 hover:bg-white hover:text-[#3d1620]"
                >
                  Join Telegram
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
