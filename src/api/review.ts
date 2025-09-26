import { api } from "@/lib/api";

export interface ReviewCreateInput {
  reviewText: string;
  rating: number; // 0 - 5
  eventId: number;
  userId: number;
}

export interface ReviewResponse {
  id: number;
  reviewText: string;
  rating: number;
  eventId: number;
  userId: number;
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

export const createReview = (data: ReviewCreateInput) =>
  api<ReviewResponse>("/reviews", {
    method: "POST",
    data,
    requiresAuth: true,
  });

export const deleteReview = (id: number) =>
  api<{ message: string; review: ReviewResponse }>(`/reviews/${id}`, {
    method: "DELETE",
    requiresAuth: true,
  });
