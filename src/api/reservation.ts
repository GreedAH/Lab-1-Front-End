import { api } from "@/lib/api";

export interface ReservationCreateInput {
  userId: number;
  eventId: number;
}

export interface Reservation {
  id: number;
  userId: number;
  eventId: number;
  price: number;
  isCancelled: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  event?: {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    venue: string;
    city: string;
    country: string;
  };
}

export interface ReservationResponse extends Reservation {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  event: {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    venue: string;
    city: string;
    country: string;
  };
}

export interface GetReservationsByUserIdParams {
  includeCancelled?: boolean;
}

export const getReservationsByUserId = (
  userId: number,
  params?: GetReservationsByUserIdParams
) => {
  const searchParams = new URLSearchParams();
  if (params?.includeCancelled !== undefined) {
    searchParams.append("includeCancelled", String(params.includeCancelled));
  }
  const queryString = searchParams.toString();
  const endpoint = queryString
    ? `/reservations/user/${userId}?${queryString}`
    : `/reservations/user/${userId}`;
  return api<ReservationResponse[]>(endpoint, {
    method: "GET",
    requiresAuth: true,
  });
};

export interface GetReservationsByEventIdParams {
  includeCancelled?: boolean;
}

export const getReservationsByEventId = (
  eventId: number,
  params?: GetReservationsByEventIdParams
) => {
  const searchParams = new URLSearchParams();
  if (params?.includeCancelled !== undefined) {
    searchParams.append("includeCancelled", String(params.includeCancelled));
  }
  const queryString = searchParams.toString();
  const endpoint = queryString
    ? `/reservations/event/${eventId}?${queryString}`
    : `/reservations/event/${eventId}`;
  return api<ReservationResponse[]>(endpoint, {
    method: "GET",
    requiresAuth: true,
  });
};

export const createReservation = (data: ReservationCreateInput) =>
  api<ReservationResponse>("/reservations", {
    method: "POST",
    data,
    requiresAuth: true,
  });

export const cancelReservation = (id: number) =>
  api<{ message: string; reservation: ReservationResponse }>(
    `/reservations/${id}/cancel`,
    {
      method: "PUT",
      requiresAuth: true,
    }
  );
