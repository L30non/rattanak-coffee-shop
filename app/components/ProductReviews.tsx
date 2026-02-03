import { useState } from "react";
import { Star, Loader2, Trash2, Edit2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { Separator } from "@/app/components/ui/separator";
import { Badge } from "@/app/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import {
  useProductReviews,
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
} from "@/app/hooks/useProducts";
import { useAuth } from "@/app/hooks/useAuth";
import { toast } from "sonner";
import type { ProductReview } from "@/app/store/useStore";

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

export function ProductReviews({
  productId,
  productName,
}: ProductReviewsProps) {
  const { user } = useAuth();
  const { data: reviews = [], isLoading } = useProductReviews(productId);
  const createReviewMutation = useCreateReview();
  const updateReviewMutation = useUpdateReview();
  const deleteReviewMutation = useDeleteReview();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<ProductReview | null>(
    null,
  );
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  // Check if user has already reviewed
  const userReview = reviews.find((r) => r.user_id === user?.id);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }

    if (rating < 1 || rating > 5) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a review");
      return;
    }

    try {
      if (editingReview) {
        await updateReviewMutation.mutateAsync({
          id: editingReview.id,
          rating,
          title: title.trim() || null,
          comment: comment.trim(),
        });
        toast.success("Review updated successfully!");
      } else {
        await createReviewMutation.mutateAsync({
          product_id: productId,
          user_id: user.id,
          rating,
          title: title.trim() || null,
          comment: comment.trim(),
        });
        toast.success("Review submitted successfully!");
      }

      setIsDialogOpen(false);
      setEditingReview(null);
      resetForm();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to submit review",
      );
    }
  };

  const handleEditReview = (review: ProductReview) => {
    setEditingReview(review);
    setRating(review.rating);
    setTitle(review.title || "");
    setComment(review.comment || "");
    setIsDialogOpen(true);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      await deleteReviewMutation.mutateAsync({ id: reviewId, productId });
      toast.success("Review deleted successfully!");
    } catch {
      toast.error("Failed to delete review");
    }
  };

  const resetForm = () => {
    setRating(5);
    setTitle("");
    setComment("");
    setHoveredRating(0);
  };

  const renderStars = (count: number, interactive: boolean = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
            disabled={!interactive}
            className={
              interactive
                ? "cursor-pointer hover:scale-110 transition-transform"
                : "cursor-default"
            }
          >
            <Star
              className={`h-5 w-5 ${
                star <= (interactive ? hoveredRating || rating : count)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "0.0";

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage:
      reviews.length > 0
        ? Math.round(
            (reviews.filter((r) => r.rating === star).length / reviews.length) *
              100,
          )
        : 0,
  }));

  return (
    <div className="mt-12">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Customer Reviews</CardTitle>
            {user && !userReview && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setEditingReview(null);
                      resetForm();
                    }}
                  >
                    Write a Review
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingReview ? "Edit Your Review" : "Write a Review"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <Label htmlFor="product-name">Product</Label>
                      <Input
                        id="product-name"
                        value={productName}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>

                    <div>
                      <Label>Rating *</Label>
                      <div className="mt-1">{renderStars(rating, true)}</div>
                    </div>

                    <div>
                      <Label htmlFor="title">Title (Optional)</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Summarize your review"
                        maxLength={100}
                      />
                    </div>

                    <div>
                      <Label htmlFor="comment">Review *</Label>
                      <Textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your experience with this product"
                        rows={5}
                        required
                        minLength={10}
                        maxLength={1000}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {comment.length}/1000 characters
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={
                          createReviewMutation.isPending ||
                          updateReviewMutation.isPending
                        }
                      >
                        {(createReviewMutation.isPending ||
                          updateReviewMutation.isPending) && (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        )}
                        {editingReview ? "Update Review" : "Submit Review"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false);
                          setEditingReview(null);
                          resetForm();
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-2">No reviews yet</p>
              <p className="text-sm">Be the first to review this product!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Rating Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b">
                <div className="flex flex-col items-center justify-center">
                  <div className="text-5xl font-bold text-[#5F1B2C] mb-2">
                    {averageRating}
                  </div>
                  {renderStars(Math.round(parseFloat(averageRating)))}
                  <p className="text-sm text-gray-600 mt-2">
                    Based on {reviews.length} review
                    {reviews.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="md:col-span-2 space-y-2">
                  {ratingDistribution.map(({ star, count, percentage }) => (
                    <div key={star} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-16">
                        <span className="text-sm font-medium">{star}</span>
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id}>
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarFallback className="bg-[#5F1B2C] text-white">
                          {review.user?.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium">
                              {review.user?.name || "Anonymous"}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {renderStars(review.rating)}
                              <span className="text-xs text-gray-500">
                                {new Date(
                                  review.created_at,
                                ).toLocaleDateString()}
                              </span>
                              {review.user_id === user?.id && (
                                <Badge variant="secondary" className="text-xs">
                                  Your review
                                </Badge>
                              )}
                            </div>
                          </div>

                          {review.user_id === user?.id && (
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditReview(review)}
                                className="h-8 w-8"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteReview(review.id)}
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                disabled={deleteReviewMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>

                        {review.title && (
                          <h4 className="font-medium mb-1">{review.title}</h4>
                        )}
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                    <Separator className="mt-6" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
