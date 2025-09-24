import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelReservation } from "@/api/reservation";

export const useCancelReservation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => cancelReservation(id),
    onSuccess: (data) => {
      // Invalidate or update related queries
      qc.invalidateQueries({ queryKey: ["reservations"] });
      qc.invalidateQueries({ queryKey: ["reservationsByEvent"] });
      qc.invalidateQueries({ queryKey: ["reservationsByUser"] });
      if (data?.reservation?.user?.id) {
        qc.invalidateQueries({
          queryKey: ["reservations", data.reservation.user.id],
        });
        qc.invalidateQueries({
          queryKey: ["reservationsByUser", data.reservation.user.id],
        });
      }
      if (data?.reservation?.event?.id) {
        qc.invalidateQueries({
          queryKey: ["reservationsByEvent", data.reservation.event.id],
        });
      }
    },
  });
};
