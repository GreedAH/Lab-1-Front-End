import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEvent, type EventCreateInput } from "@/api/events";

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EventCreateInput) => createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};
