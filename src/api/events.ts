import { api } from "@/lib/api";
import { EventStatus } from "@/types/enums";

export interface EventCreateInput {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  venue: string;
  country: string;
  city: string;
  status?: EventStatus;
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
  status: EventStatus;
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
  status?: EventStatus;
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

export const getEventById = (id: number) =>
  api<Event>(`/events/${id}`, {
    method: "GET",
  });

export interface EventUpdateInput {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  venue?: string;
  country?: string;
  city?: string;
  status?: EventStatus;
  maxCapacity?: number;
  price?: number;
}

export const updateEvent = (id: number, data: EventUpdateInput) =>
  api<Event>(`/events/${id}`, {
    method: "PUT",
    data,
  });

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

export interface GetAllEventsPublicParams {
  country?: string;
  city?: string;
}

export const getAllEventsSortedByStatus = (
  params?: GetAllEventsPublicParams
) => {
  const searchParams = new URLSearchParams();
  if (params?.country) searchParams.append("country", params.country);
  if (params?.city) searchParams.append("city", params.city);

  const queryString = searchParams.toString();
  const endpoint = queryString
    ? `/events/public/sorted?${queryString}`
    : "/events/public/sorted";

  return api<Event[]>(endpoint, {
    method: "GET",
  });
};
