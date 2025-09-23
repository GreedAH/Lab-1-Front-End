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

export const createReservation = (data: ReservationCreateInput) =>
  api<ReservationResponse>("/reservations", {
    method: "POST",
    data,
    requiresAuth: true,
  });
