import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createReservation,
  type ReservationCreateInput,
} from "@/api/reservation";

export const useCreateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReservationCreateInput) => createReservation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};
