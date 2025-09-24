import { useParams } from "react-router-dom";
import { useGetReservationsByEventId } from "@/hooks/queries/reservation/useGetReservationsByEventId";
import { format } from "date-fns";
import { Calendar, MapPin, DollarSign, Trash2 } from "lucide-react";

export function EventReservationsList() {
  const { id } = useParams();
  const eventId = Number(id);
  const {
    data: reservations,
    isLoading,
    error,
  } = useGetReservationsByEventId(eventId);

  if (!eventId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Invalid Event
          </h3>
          <p className="text-red-600">No event id provided.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading reservations...</p>
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
                Error Loading Reservations
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
            Event Reservations
          </h1>
          <p className="mt-2 text-gray-600">View reservations for this event</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {reservations?.length} Reservation
                {reservations?.length !== 1 ? "s" : ""} Found
              </h2>
            </div>
            <div className="grid gap-6">
              {reservations?.map((reservation) => (
                <div
                  key={reservation.id}
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
                            {reservation.user?.firstName}{" "}
                            {reservation.user?.lastName}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full border ${
                                reservation.isCancelled
                                  ? "bg-gray-100 text-gray-800 border-gray-200"
                                  : "bg-green-100 text-green-800 border-green-200"
                              }`}
                            >
                              {reservation.isCancelled
                                ? "Cancelled"
                                : "Reserved"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Start Date</p>
                        <p className="text-gray-900 font-medium">
                          {reservation.event?.startDate
                            ? format(
                                new Date(reservation.event.startDate),
                                "MMM dd, yyyy"
                              )
                            : "-"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">End Date</p>
                        <p className="text-gray-900 font-medium">
                          {reservation.event?.endDate
                            ? format(
                                new Date(reservation.event.endDate),
                                "MMM dd, yyyy"
                              )
                            : "-"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="text-gray-900 font-medium">
                          {reservation.event?.city},{" "}
                          {reservation.event?.country}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Venue</p>
                        <p className="text-gray-900 font-medium">
                          {reservation.event?.venue}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="text-gray-900 font-medium">
                          ${Number(reservation?.price || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Trash2 className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Cancelled</p>
                        <p className="text-gray-900 font-medium">
                          {reservation.isCancelled ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Reserved By</p>
                    <p className="text-gray-900 font-medium">
                      {reservation.user?.firstName} {reservation.user?.lastName}{" "}
                      ({reservation.user?.email})
                    </p>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <p>
                      Created:{" "}
                      {format(new Date(reservation.createdAt), "MMM dd, yyyy")}
                    </p>
                    <p>
                      Updated:{" "}
                      {format(new Date(reservation.updatedAt), "MMM dd, yyyy")}
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
