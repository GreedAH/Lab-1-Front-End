import { useQuery } from "@tanstack/react-query";
import { getReservationsByEventId } from "@/api/reservation";

export const useGetReservationsByEventId = (
  eventId: number,
  params?: { includeCancelled?: boolean }
) => {
  return useQuery({
    queryKey: ["reservationsByEvent", eventId, params],
    queryFn: () => getReservationsByEventId(eventId, params),
  });
};
