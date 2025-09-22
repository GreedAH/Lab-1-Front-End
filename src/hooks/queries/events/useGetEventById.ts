import { useQuery } from "@tanstack/react-query";
import { getEventById, type Event } from "@/api/events";

type GetEventByIdOptions = {
  enabled?: boolean;
  onSuccess?: (event: Event) => void;
};

export const useGetEventById = (id: number, options?: GetEventByIdOptions) => {
  return useQuery({
    queryKey: ["event", id] as const,
    queryFn: () => getEventById(id),
    ...options,
  });
};
