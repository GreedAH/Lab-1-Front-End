import { useGetAllEvents } from "@/hooks/queries/events/useGetAllEvents";
import { useDeleteEvent } from "@/hooks/mutations/events/useDeleteEvent";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, DollarSign, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import type { ApiError } from "@/lib/api";

export function EventsList() {
  const { data: events, isLoading, error } = useGetAllEvents();
  const deleteEvent = useDeleteEvent();
  const [deletingEventId, setDeletingEventId] = useState<number | null>(null);

  const handleDeleteEvent = async (eventId: number, eventName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${eventName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingEventId(eventId);
    try {
      await deleteEvent.mutateAsync(eventId);
      toast.success("Event deleted successfully");
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.message || "Failed to delete event");
    } finally {
      setDeletingEventId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-green-100 text-green-800 border-green-200";
      case "CLOSED":
        return "bg-red-100 text-red-800 border-red-200";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Error Loading Events
              </h3>
              <p className="text-red-600">
                {error instanceof Error
                  ? error.message
                  : "An unexpected error occurred"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            Events
          </h1>
          <p className="mt-2 text-gray-600">
            Discover and explore all available events
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {events?.length} Event{events?.length !== 1 ? "s" : ""} Found
              </h2>
            </div>

            <div className="grid gap-6">
              {events?.map((event) => (
                <div
                  key={event.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-xl text-gray-900">
                            {event.name}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                                event.status
                              )}`}
                            >
                              {event.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDeleteEvent(event.id, event.name)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                      disabled={deletingEventId === event.id}
                    >
                      <Trash2 className="w-4 h-4" />
                      {deletingEventId === event.id ? "Deleting..." : "Delete"}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Start Date</p>
                        <p className="text-gray-900 font-medium">
                          {format(new Date(event.startDate), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">End Date</p>
                        <p className="text-gray-900 font-medium">
                          {format(new Date(event.endDate), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="text-gray-900 font-medium">
                          {event.city}, {event.country}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Venue</p>
                        <p className="text-gray-900 font-medium">
                          {event.venue}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Max Capacity</p>
                        <p className="text-gray-900 font-medium">
                          {event.maxCapacity.toLocaleString()} people
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="text-gray-900 font-medium">
                          ${Number(event?.price || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Description</p>
                    <p className="text-gray-900 line-clamp-3">
                      {event.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <p>
                      Created:{" "}
                      {format(new Date(event.createdAt), "MMM dd, yyyy")}
                    </p>
                    <p>
                      Updated:{" "}
                      {format(new Date(event.updatedAt), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
