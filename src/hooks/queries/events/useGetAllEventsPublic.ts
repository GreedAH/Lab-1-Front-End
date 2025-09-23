import { useQuery } from "@tanstack/react-query";
import {
  getAllEventsSortedByStatus,
  type GetAllEventsPublicParams,
} from "@/api/events";

export const useGetAllEventsPublic = (params?: GetAllEventsPublicParams) => {
  return useQuery({
    queryKey: ["events", "public", "sorted", params],
    queryFn: () => getAllEventsSortedByStatus(params),
  });
};
