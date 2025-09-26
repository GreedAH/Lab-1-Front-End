import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useCreateReview } from "@/hooks/mutations/review/useCreateReview";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";

const reviewSchema = z.object({
  reviewText: z.string().min(1, "Review cannot be empty").max(1000),
  rating: z.number().int().min(0).max(5),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

export default function ReviewForm({
  eventId,
  onDone,
}: {
  eventId: number;
  onDone?: () => void;
}) {
  const { user } = useUser();
  const create = useCreateReview();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { reviewText: "", rating: 5 },
  });

  const rating = watch("rating");

  const onSubmit = async (values: ReviewFormValues) => {
    if (!user) return toast.error("You must be logged in to submit a review");

    try {
      setIsSubmitting(true);
      await create.mutateAsync({
        reviewText: values.reviewText.trim(),
        rating: values.rating,
        eventId,
        userId: user.id,
      });
      toast.success("Review submitted");
      reset();
      onDone?.();
    } catch (err: unknown) {
      const message =
        (err as { message?: string })?.message ?? "Failed to submit review";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 border-t pt-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, i) => {
            const idx = i + 1;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setValue("rating", idx)}
                className={`p-1 rounded ${
                  idx <= rating ? "text-yellow-400" : "text-gray-300"
                }`}
                aria-label={`Rate ${idx} star${idx > 1 ? "s" : ""}`}
              >
                <Star className="w-5 h-5" />
              </button>
            );
          })}
        </div>
        <div className="text-sm text-gray-600">{rating} / 5</div>
      </div>

      <Textarea
        {...register("reviewText")}
        placeholder="Write your review..."
        rows={4}
      />
      {errors.reviewText && (
        <div className="text-sm text-red-600 mt-1">
          {errors.reviewText.message}
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <Button
          type="submit"
          size="sm"
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit review"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            reset();
            onDone?.();
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
