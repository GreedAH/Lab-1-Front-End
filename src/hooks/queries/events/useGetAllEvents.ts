import { useQuery } from "@tanstack/react-query";
import { getAllEvents, type GetAllEventsParams } from "@/api/events";

export const useGetAllEvents = (params?: GetAllEventsParams) => {
  return useQuery({
    queryKey: ["events", params],
    queryFn: () => getAllEvents(params),
  });
};
