import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReview, type ReviewCreateInput } from "@/api/review";

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReviewCreateInput) => createReview(data),
    onSuccess: (created) => {
      // invalidate all reviews lists and per-event queries so UI updates
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      if (created?.eventId) {
        queryClient.invalidateQueries({
          queryKey: ["reviews", created.eventId],
        });
        queryClient.invalidateQueries({
          queryKey: ["events", created.eventId],
        });
      }
    },
  });
};
