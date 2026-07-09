export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  datePublished: string;
  readTime: string;
  image: string;
  content: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "how-to-choose-the-right-coffee-machine-for-your-cafe",
    title: "How to Choose the Right Coffee Machine for Your Cafe",
    excerpt:
      "Starting a cafe? The coffee machine is your most important investment. Learn how to pick the right one based on your budget, volume, and style.",
    category: "Guide",
    date: "January 15, 2025",
    datePublished: "2025-01-15",
    readTime: "5 min read",
    image:
      "https://qboxqdnuoqpsrmqtaaaf.supabase.co/storage/v1/object/public/Images/branding/brownroaster.jpg",
    content:
      "Choosing the right coffee machine is crucial for any cafe. Consider factors like daily volume, drink types, maintenance requirements, and budget. Semi-automatic machines offer control, while fully automatic machines ensure consistency. We recommend starting with a reliable dual-boiler machine for cafes serving 100-200 cups daily.",
  },
  {
    id: "2",
    slug: "the-art-of-coffee-roasting-from-green-beans-to-perfect-cup",
    title: "The Art of Coffee Roasting: From Green Beans to Perfect Cup",
    excerpt:
      "Discover the journey of coffee beans from raw green seeds to the aromatic roasted beans that create your favorite beverages.",
    category: "Education",
    date: "December 28, 2024",
    datePublished: "2024-12-28",
    readTime: "7 min read",
    image:
      "https://qboxqdnuoqpsrmqtaaaf.supabase.co/storage/v1/object/public/Images/branding/brownroaster.jpg",
    content:
      "Coffee roasting is both a science and an art. The process involves carefully applying heat to green coffee beans, transforming them through chemical reactions that develop flavor, aroma, and color. At Rattanak Coffee, our master roasters monitor temperature profiles carefully to bring out the unique characteristics of each origin.",
  },
  {
    id: "3",
    slug: "5-essential-accessories-every-barista-needs",
    title: "5 Essential Accessories Every Barista Needs",
    excerpt:
      "From precision scales to tampers, these are the must-have tools that will elevate your coffee-making game to professional level.",
    category: "Tips",
    date: "December 10, 2024",
    datePublished: "2024-12-10",
    readTime: "4 min read",
    image:
      "https://qboxqdnuoqpsrmqtaaaf.supabase.co/storage/v1/object/public/Images/branding/brownroaster.jpg",
    content:
      "Every barista needs the right tools. A precision scale ensures consistent dosing, a quality tamper delivers even extraction, a good grinder unlocks flavor potential, a milk pitcher for latte art, and a knock box for efficient workflow. Invest in quality accessories and your drinks will improve dramatically.",
  },
  {
    id: "4",
    slug: "understanding-coffee-bean-origins-a-world-tour",
    title: "Understanding Coffee Bean Origins: A World Tour",
    excerpt:
      "Take a journey through the world's finest coffee-growing regions and learn how geography shapes the flavors in your cup.",
    category: "Education",
    date: "November 20, 2024",
    datePublished: "2024-11-20",
    readTime: "6 min read",
    image:
      "https://qboxqdnuoqpsrmqtaaaf.supabase.co/storage/v1/object/public/Images/branding/brownroaster.jpg",
    content:
      "Coffee grown in Ethiopia tends to be fruity and floral, while Colombian beans offer balanced sweetness. Brazilian coffees are nutty and chocolatey, and Indonesian beans are earthy and full-bodied. Understanding origins helps you select the right beans for your cafe's signature drinks.",
  },
  {
    id: "5",
    slug: "starting-a-cafe-in-cambodia-what-you-need-to-know",
    title: "Starting a Cafe in Cambodia: What You Need to Know",
    excerpt:
      "A comprehensive guide for aspiring cafe owners in Cambodia, covering licensing, equipment, location, and building a loyal customer base.",
    category: "Business",
    date: "November 5, 2024",
    datePublished: "2024-11-05",
    readTime: "8 min read",
    image:
      "https://qboxqdnuoqpsrmqtaaaf.supabase.co/storage/v1/object/public/Images/branding/brownroaster.jpg",
    content:
      "Cambodia's cafe scene is booming. To start your own cafe, focus on finding the right location with foot traffic, invest in quality equipment, source fresh local and imported beans, and create a welcoming atmosphere. Rattanak Coffee can supply everything you need from machines to beans to training.",
  },
  {
    id: "6",
    slug: "the-perfect-espresso-a-step-by-step-guide",
    title: "The Perfect Espresso: A Step-by-Step Guide",
    excerpt:
      "Master the fundamentals of pulling a perfect espresso shot with this detailed guide covering grind size, dose, timing, and technique.",
    category: "Guide",
    date: "October 18, 2024",
    datePublished: "2024-10-18",
    readTime: "5 min read",
    image:
      "https://qboxqdnuoqpsrmqtaaaf.supabase.co/storage/v1/object/public/Images/branding/brownroaster.jpg",
    content:
      "The perfect espresso starts with freshly ground beans at the right size. Use 18-20g of coffee, tamp evenly with 30 pounds of pressure, and aim for a 25-30 second extraction yielding 36-40ml. The result should be a rich, caramel-colored shot with a thick crema on top.",
  },
];

export const blogCategories = ["All", "Guide", "Education", "Tips", "Business"];

export function getPosts(): BlogPost[] {
  return blogPosts;
}

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
