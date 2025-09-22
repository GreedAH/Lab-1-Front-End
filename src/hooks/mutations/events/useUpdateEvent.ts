import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEvent, type EventUpdateInput } from "@/api/events";

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: EventUpdateInput }) =>
      updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};
