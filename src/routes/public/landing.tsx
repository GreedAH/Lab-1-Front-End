import { Navigation } from "@/components/navigation";
import { useGetAllEventsPublic } from "@/hooks/queries/events/useGetAllEventsPublic";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

export function Landing() {
  const { data: events, isLoading, error } = useGetAllEventsPublic();
  const navigate = useNavigate();
  const { user } = useUser();

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

  const handleReserve = (eventId: number) => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(`/reserve/${eventId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 p-8">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Welcome to ETS
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Discover amazing events and reserve your spot today
            </p>
          </div>

          {isLoading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading events...</p>
            </div>
          )}

          {error && (
            <div className="text-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
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
          )}

          {events && events.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Featured Events
                </h2>
                <p className="text-gray-600">
                  {events.length} Event{events.length !== 1 ? "s" : ""}{" "}
                  Available
                </p>
              </div>

              <div className="grid gap-6">
                {events.slice(0, 6).map((event) => (
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
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleReserve(event.id)}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                          size="sm"
                        >
                          Reserve
                        </Button>
                      </div>
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
                  </div>
                ))}
              </div>

              {events.length > 6 && (
                <div className="text-center mt-8">
                  <p className="text-gray-600">
                    Showing 6 of {events.length} events.
                    <span className="text-purple-600 font-medium ml-1">
                      Sign up to see all events and make reservations!
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}

          {events && events.length === 0 && (
            <div className="text-center">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  No Events Available
                </h3>
                <p className="text-gray-600">
                  Check back later for exciting events!
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
