"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Separator } from "@/app/components/ui/separator";
import {
  ArrowLeft,
  X,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  Camera,
  Plus,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";
import {
  useGalleries,
  useAddGallery,
  useUpdateGallery,
  useDeleteGallery,
} from "@/app/hooks/useGalleries";
import type { Gallery as GalleryImage } from "@/app/store/useStore";
import { uploadImage, getImageUrl } from "@/utils/supabase/client";
import { toast } from "sonner";

interface GalleryProps {
  onNavigate: (view: string) => void;
}

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
  const { user } = useAuth();
  const isAdmin = !!user?.is_admin;

  const { data: galleryImages = [], isLoading } = useGalleries();
  const addGalleryMutation = useAddGallery();
  const updateGalleryMutation = useUpdateGallery();
  const deleteGalleryMutation = useDeleteGallery();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [imageToDelete, setImageToDelete] = useState<{
    id: string;
    alt: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newImage, setNewImage] = useState({
    src: null as string | null,
    alt: "",
    category: "Roastery",
  });

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

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isEdit: boolean = false,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    const { path, error } = await uploadImage(file, "gallery");
    setIsUploading(false);

    if (error) {
      toast.error(`Upload failed: ${error}`);
      return;
    }

    if (path) {
      if (isEdit && editingImage) {
        setEditingImage({ ...editingImage, src: path });
      } else {
        setNewImage({ ...newImage, src: path });
      }
      toast.success("Image uploaded successfully");
    }
  };

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage.src) {
      toast.error("Please upload an image");
      return;
    }

    addGalleryMutation.mutate(
      {
        src: newImage.src,
        alt: newImage.alt,
        category: newImage.category,
        sort_order: galleryImages.length + 1,
      },
      {
        onSuccess: () => {
          toast.success("Image added to gallery");
          setIsAddDialogOpen(false);
          setNewImage({ src: null, alt: "", category: "Roastery" });
        },
        onError: (error) => {
          toast.error(`Failed to add image: ${error.message}`);
        },
      },
    );
  };

  const handleUpdateImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingImage) return;

    updateGalleryMutation.mutate(
      {
        id: editingImage.id,
        src: editingImage.src,
        alt: editingImage.alt,
        category: editingImage.category,
      },
      {
        onSuccess: () => {
          toast.success("Gallery image updated");
          setIsEditDialogOpen(false);
          setEditingImage(null);
        },
        onError: (error) => {
          toast.error(`Failed to update image: ${error.message}`);
        },
      },
    );
  };

  const confirmDelete = () => {
    if (!imageToDelete) return;

    deleteGalleryMutation.mutate(imageToDelete.id, {
      onSuccess: () => {
        toast.success("Image removed from gallery");
        setImageToDelete(null);
      },
      onError: (error) => {
        toast.error(`Failed to delete image: ${error.message}`);
      },
    });
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
              {isLoading
                ? "Loading photos…"
                : `Showing ${filteredImages.length} ${
                    filteredImages.length === 1 ? "photo" : "photos"
                  }${
                    selectedCategory !== "All"
                      ? ` in "${selectedCategory}"`
                      : ""
                  }`}
            </p>

            {isAdmin && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#5F1B2C] hover:bg-[#4a1523]">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Image
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add Gallery Image</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddImage} className="space-y-4">
                    <div>
                      <Label htmlFor="galleryImageUpload">Image *</Label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Input
                            id="galleryImageUpload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, false)}
                            disabled={isUploading}
                            className="flex-1"
                          />
                          {isUploading && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          )}
                        </div>
                        {newImage.src && (
                          <div className="flex items-center gap-2">
                            <div className="relative h-16 w-16 rounded overflow-hidden">
                              <Image
                                src={getImageUrl(newImage.src) || ""}
                                alt="Preview"
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="text-sm text-gray-500 truncate flex-1">
                              {newImage.src}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setNewImage({ ...newImage, src: null })
                              }
                            >
                              Remove
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="galleryAlt">Caption *</Label>
                      <Input
                        id="galleryAlt"
                        value={newImage.alt}
                        onChange={(e) =>
                          setNewImage({ ...newImage, alt: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="galleryCategory">Category *</Label>
                      <Select
                        value={newImage.category}
                        onValueChange={(value) =>
                          setNewImage({ ...newImage, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {galleryCategories
                            .filter((c) => c !== "All")
                            .map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#5F1B2C] hover:bg-[#4a1523]"
                    >
                      Add Image
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <motion.div
            key={isLoading ? "loading" : "loaded"}
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
            {isLoading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <motion.div
                  key={`skeleton-${index}`}
                  variants={{
                    hidden: { opacity: 0, scale: 0.9 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                >
                  <div className="aspect-square rounded-lg bg-gray-200 animate-pulse" />
                </motion.div>
              ))
            ) : filteredImages.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No photos in this category
                </h3>
                <p className="text-gray-500">
                  Try selecting a different category to see more photos.
                </p>
              </div>
            ) : (
              filteredImages.map((image, index) => (
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
                      src={getImageUrl(image.src)}
                      alt={image.alt}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    {isAdmin && (
                      <div className="absolute top-2 right-2 z-20 flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingImage(image);
                            setIsEditDialogOpen(true);
                          }}
                          className="bg-white/90 hover:bg-white text-gray-700 rounded-full p-1.5 shadow"
                          aria-label="Edit image"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setImageToDelete({ id: image.id, alt: image.alt });
                          }}
                          className="bg-white/90 hover:bg-white text-red-600 rounded-full p-1.5 shadow"
                          aria-label="Delete image"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
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
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* Edit Image Dialog */}
      {editingImage && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Gallery Image</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateImage} className="space-y-4">
              <div>
                <Label htmlFor="editGalleryImageUpload">Image</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      id="editGalleryImageUpload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, true)}
                      disabled={isUploading}
                      className="flex-1"
                    />
                    {isUploading && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                  </div>
                  {editingImage.src && (
                    <div className="flex items-center gap-2">
                      <div className="relative h-16 w-16 rounded overflow-hidden">
                        <Image
                          src={getImageUrl(editingImage.src) || ""}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm text-gray-500 truncate flex-1">
                        {editingImage.src}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="editGalleryAlt">Caption *</Label>
                <Input
                  id="editGalleryAlt"
                  value={editingImage.alt}
                  onChange={(e) =>
                    setEditingImage({ ...editingImage, alt: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="editGalleryCategory">Category *</Label>
                <Select
                  value={editingImage.category}
                  onValueChange={(value) =>
                    setEditingImage({ ...editingImage, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {galleryCategories
                      .filter((c) => c !== "All")
                      .map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#5F1B2C] hover:bg-[#4a1523]"
              >
                Save Changes
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!imageToDelete}
        onOpenChange={(open) => !open && setImageToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this image?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove &ldquo;{imageToDelete?.alt}&rdquo;
              from the gallery. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredImages[lightboxIndex] && (
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
                src={getImageUrl(filteredImages[lightboxIndex].src)}
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
