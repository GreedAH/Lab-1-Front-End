import { useQuery } from "@tanstack/react-query";
import { getReservationsByUserId } from "@/api/reservation";
import type { GetReservationsByUserIdParams } from "@/api/reservation";

export const useGetReservationsByUserId = (
  userId: number,
  params?: GetReservationsByUserIdParams
) => {
  return useQuery({
    queryKey: ["reservations", userId, params],
    queryFn: () => getReservationsByUserId(userId, params),
  });
};
