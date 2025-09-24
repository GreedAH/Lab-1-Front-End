import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetEventById } from "@/hooks/queries/events/useGetEventById";
import { useCreateReservation } from "@/hooks/mutations/reservation/useCreateReservation";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, MapPin, Users, DollarSign, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import type { ApiError } from "@/lib/api";

export function CreateReservation() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [quantity, setQuantity] = useState(1);

  const {
    data: event,
    isLoading,
    error,
  } = useGetEventById(Number(eventId), {
    enabled: !!eventId,
  });

  const createReservation = useCreateReservation();

  const remainingSeats = event
    ? Math.max(0, event.maxCapacity - (event.reservationCount ?? 0))
    : 0;

  useEffect(() => {
    if (remainingSeats === 0) {
      setQuantity(0);
      return;
    }

    if (quantity < 1) {
      setQuantity(1);
      return;
    }

    if (quantity > remainingSeats) {
      setQuantity(remainingSeats);
    }
    // only run when remainingSeats changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingSeats]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !eventId) {
      toast.error("User not found or invalid event");
      return;
    }

    if (quantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }

    if (event && quantity > remainingSeats) {
      toast.error(
        `Quantity cannot exceed remaining seats of ${remainingSeats}`
      );
      return;
    }

    try {
      // Create multiple reservations based on quantity
      const promises = Array.from({ length: quantity }, () =>
        createReservation.mutateAsync({
          userId: user.id,
          eventId: Number(eventId),
        })
      );

      await Promise.all(promises);

      toast.success(
        `Successfully created ${quantity} reservation${
          quantity > 1 ? "s" : ""
        }!`
      );
      navigate("/dashboard");
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.message || "Failed to create reservation");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading event details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Error Loading Event
              </h3>
              <p className="text-red-600">
                {error instanceof Error
                  ? error.message
                  : "Event not found or not available for reservations"}
              </p>
              <Button
                onClick={() => navigate("/client/events")}
                className="mt-4"
                variant="outline"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

  const totalPrice = event.price * quantity;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Button
            onClick={() => navigate("/client/events")}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            Create Reservation
          </h1>
          <p className="mt-2 text-gray-600">
            Reserve your spot for this amazing event
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Event Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">{event.name}</CardTitle>
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
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
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
                    <p className="text-gray-900 font-medium">{event.venue}</p>
                  </div>
                </div>

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
                    <p className="text-sm text-gray-500">Price per Person</p>
                    <p className="text-gray-900 font-medium">
                      ${Number(event.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500 mb-1">Description</p>
                <p className="text-gray-900">{event.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Reservation Form */}
          <Card>
            <CardHeader>
              <CardTitle>Reservation Details</CardTitle>
              <CardDescription>
                Enter the number of reservations you want to create
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Number of Reservations</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min={String(remainingSeats > 0 ? 1 : 0)}
                    max={String(remainingSeats)}
                    value={quantity}
                    onChange={(e) => {
                      if (remainingSeats <= 0) {
                        setQuantity(0);
                        return;
                      }
                      const val = Number(e.target.value) || 1;
                      const clamped = Math.max(
                        1,
                        Math.min(val, remainingSeats)
                      );
                      setQuantity(clamped);
                    }}
                    className="w-full"
                    required
                    disabled={remainingSeats <= 0}
                  />
                  <p className="text-sm text-gray-500">
                    Remaining tickets: {remainingSeats.toLocaleString()}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Price per person:</span>
                    <span>${Number(event.price).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Quantity:</span>
                    <span>{quantity}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    disabled={
                      createReservation.isPending ||
                      event.status !== "OPEN" ||
                      remainingSeats <= 0
                    }
                  >
                    {createReservation.isPending
                      ? "Creating Reservations..."
                      : remainingSeats <= 0
                      ? "Sold Out"
                      : `Create ${quantity} Reservation${
                          quantity > 1 ? "s" : ""
                        }`}
                  </Button>

                  {event.status !== "OPEN" && (
                    <p className="text-sm text-red-600 text-center">
                      This event is not available for reservations
                    </p>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
