import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Separator } from "@/app/components/ui/separator";
import {
  ArrowLeft,
  X,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  Camera,
} from "lucide-react";

interface GalleryProps {
  onNavigate: (view: string) => void;
}

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
}

const galleryImages: GalleryImage[] = [
  {
    id: "1",
    src: "https://amsvlqivarurifjhboef.supabase.co/storage/v1/object/public/Images/gallery/gallery-1.webp",
    alt: "Rattanak Coffee roasting facility",
    category: "Roastery",
  },
  {
    id: "2",
    src: "https://amsvlqivarurifjhboef.supabase.co/storage/v1/object/public/Images/gallery/gallery-2.jpg",
    alt: "Fresh coffee beans being prepared",
    category: "Beans",
  },
  {
    id: "3",
    src: "https://amsvlqivarurifjhboef.supabase.co/storage/v1/object/public/Images/gallery/gallery-3.jpg",
    alt: "Professional espresso machine in action",
    category: "Machines",
  },
  {
    id: "4",
    src: "https://amsvlqivarurifjhboef.supabase.co/storage/v1/object/public/Images/gallery/gallery-4.webp",
    alt: "Latte art being created by a barista",
    category: "Barista",
  },
  {
    id: "5",
    src: "https://amsvlqivarurifjhboef.supabase.co/storage/v1/object/public/Images/gallery/gallery-5.webp",
    alt: "Coffee accessories and brewing tools",
    category: "Accessories",
  },
  {
    id: "6",
    src: "https://amsvlqivarurifjhboef.supabase.co/storage/v1/object/public/Images/gallery/gallery-6.jpg",
    alt: "Rattanak Coffee shop interior",
    category: "Shop",
  },
  {
    id: "7",
    src: "https://amsvlqivarurifjhboef.supabase.co/storage/v1/object/public/Images/gallery/gallery-7.jpg",
    alt: "Coffee cupping session",
    category: "Events",
  },
  {
    id: "8",
    src: "https://amsvlqivarurifjhboef.supabase.co/storage/v1/object/public/Images/gallery/gallery-8.jpg",
    alt: "Green coffee beans before roasting",
    category: "Beans",
  },
  {
    id: "9",
    src: "https://amsvlqivarurifjhboef.supabase.co/storage/v1/object/public/Images/gallery/gallery-9.jpg",
    alt: "Barista training workshop",
    category: "Events",
  },
  {
    id: "10",
    src: "https://amsvlqivarurifjhboef.supabase.co/storage/v1/object/public/Images/gallery/gallery-10.webp",
    alt: "Coffee delivery and packaging",
    category: "Shop",
  },
  {
    id: "11",
    src: "https://amsvlqivarurifjhboef.supabase.co/storage/v1/object/public/Images/gallery/gallery-11.avif",
    alt: "Espresso extraction close-up",
    category: "Machines",
  },
  {
    id: "12",
    src: "https://amsvlqivarurifjhboef.supabase.co/storage/v1/object/public/Images/gallery/gallery-12.avif",
    alt: "Rattanak Coffee team at work",
    category: "Roastery",
  },
];

const galleryCategories = [
  "All",
  "Roastery",
  "Beans",
  "Machines",
  "Barista",
  "Accessories",
  "Shop",
  "Events",
];

export function Gallery({ onNavigate }: GalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredImages = galleryImages.filter(
    (img) => selectedCategory === "All" || img.category === selectedCategory,
  );

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goToPrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(
        lightboxIndex === 0 ? filteredImages.length - 1 : lightboxIndex - 1,
      );
    }
  };

  const goToNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(
        lightboxIndex === filteredImages.length - 1 ? 0 : lightboxIndex + 1,
      );
    }
  };

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Gallery</h1>
            <p className="text-xl text-rose-100 max-w-2xl">
              A visual journey through Rattanak Coffee &mdash; our roastery,
              products, events, and the people behind every cup.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-6 bg-white border-b sticky top-16 z-30">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <Grid3X3 className="h-5 w-5 text-gray-400 flex-shrink-0" />
            {galleryCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
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
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-600">
              Showing {filteredImages.length}{" "}
              {filteredImages.length === 1 ? "photo" : "photos"}
              {selectedCategory !== "All" && ` in "${selectedCategory}"`}
            </p>
          </div>

          {filteredImages.length === 0 ? (
            <div className="text-center py-16">
              <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No photos in this category
              </h3>
              <p className="text-gray-500">
                Try selecting a different category to see more photos.
              </p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.05 },
                },
              }}
            >
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  variants={{
                    hidden: { opacity: 0, scale: 0.9 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="group cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
                    <ImageWithFallback
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end">
                      <div className="p-3 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-white text-sm font-medium truncate">
                          {image.alt}
                        </p>
                        <span className="text-white/70 text-xs">
                          {image.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="h-8 w-8" />
            </button>

            {/* Prev Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              className="absolute left-4 text-white hover:text-gray-300 z-10"
            >
              <ChevronLeft className="h-10 w-10" />
            </button>

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-4xl h-[80vh] mx-16"
              onClick={(e) => e.stopPropagation()}
            >
              <ImageWithFallback
                src={filteredImages[lightboxIndex].src}
                alt={filteredImages[lightboxIndex].alt}
                fill
                className="object-contain"
                sizes="100vw"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <p className="text-white font-medium">
                  {filteredImages[lightboxIndex].alt}
                </p>
                <p className="text-white/60 text-sm">
                  {filteredImages[lightboxIndex].category} &middot;{" "}
                  {lightboxIndex + 1} / {filteredImages.length}
                </p>
              </div>
            </motion.div>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 text-white hover:text-gray-300 z-10"
            >
              <ChevronRight className="h-10 w-10" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[#4a1523] to-[#5F1B2C] text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Want to See More?</h2>
            <p className="text-rose-100 mb-8 max-w-xl mx-auto">
              Follow us on social media for daily updates, behind-the-scenes
              content, and more from Rattanak Coffee.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://www.instagram.com/rattanakcoffee/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-white text-[#3d1620] hover:bg-rose-50"
                >
                  Follow on Instagram
                </Button>
              </a>
              <a
                href="https://www.facebook.com/rattanakcoffeeroaster"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white bg-white/10 hover:bg-white hover:text-[#3d1620]"
                >
                  Follow on Facebook
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
