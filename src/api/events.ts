import { api } from "@/lib/api";

export interface EventCreateInput {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  venue: string;
  country: string;
  city: string;
  status?: "OPEN" | "CLOSED" | "CANCELLED";
  maxCapacity: number;
  price: number;
}

export interface Event {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  venue: string;
  country: string;
  city: string;
  status: "OPEN" | "CLOSED" | "CANCELLED";
  maxCapacity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export const createEvent = (data: EventCreateInput) =>
  api<Event>("/events", {
    method: "POST",
    data,
  });

export interface GetAllEventsParams {
  status?: "OPEN" | "CLOSED" | "CANCELLED";
  country?: string;
  city?: string;
}

export const getAllEvents = (params?: GetAllEventsParams) => {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.append("status", params.status);
  if (params?.country) searchParams.append("country", params.country);
  if (params?.city) searchParams.append("city", params.city);

  const queryString = searchParams.toString();
  const endpoint = queryString ? `/events?${queryString}` : "/events";

  return api<Event[]>(endpoint, {
    method: "GET",
  });
};

export interface DeleteEventResponse {
  message: string;
  event: {
    id: number;
    name: string;
    venue: string;
    city: string;
    country: string;
  };
}

export const deleteEvent = (id: number) =>
  api<DeleteEventResponse>(`/events/${id}`, {
    method: "DELETE",
  });
