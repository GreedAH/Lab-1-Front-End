import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateEvent } from "@/hooks/mutations/events/useCreateEvent";
import { toast } from "sonner";
import type { ApiError } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

const eventFormSchema = z.object({
  name: z.string().min(2, "Event name must be at least 2 characters"),
  eventType: z.enum(["single", "multiple"], {
    required_error: "Please select an event type",
  }),
  startDate: z.date({
    required_error: "Please select a start date",
  }),
  endDate: z.date({
    required_error: "Please select an end date",
  }),
  venue: z.string().min(2, "Venue must be at least 2 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  maxCapacity: z
    .number()
    .min(1, "Max capacity must be at least 1")
    .int("Max capacity must be a whole number"),
  price: z.number().min(0, "Price cannot be negative"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

export function CreateEventForm() {
  const createEvent = useCreateEvent();
  const [eventType, setEventType] = useState<"single" | "multiple">("single");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: "",
      eventType: "single",
      venue: "",
      country: "",
      city: "",
      maxCapacity: 1,
      price: 0,
      description: "",
    },
  });

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const onSubmit = async (data: EventFormValues) => {
    try {
      // For single day events, set endDate to startDate
      const finalEndDate =
        eventType === "single" ? data.startDate : data.endDate;

      await createEvent.mutateAsync({
        name: data.name,
        description: data.description,
        startDate: format(data.startDate, "yyyy-MM-dd"),
        endDate: format(finalEndDate, "yyyy-MM-dd"),
        venue: data.venue,
        country: data.country,
        city: data.city,
        status: "OPEN",
        maxCapacity: data.maxCapacity,
        price: data.price,
      });
      toast.success("Event created successfully");
      reset();
      setEventType("single");
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.message || "Failed to create event");
    }
  };

  const handleEventTypeChange = (value: "single" | "multiple") => {
    setEventType(value);
    setValue("eventType", value);

    // If switching to single day, clear endDate
    if (value === "single") {
      setValue("endDate", startDate);
    }
  };

  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      setValue("startDate", date);
      // For single day events, also set endDate
      if (eventType === "single") {
        setValue("endDate", date);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Event Name and Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Event Name
          </label>
          <Input
            id="name"
            type="text"
            {...register("name")}
            placeholder="Enter event name"
            className="w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500"
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Event Type
          </label>
          <Select value={eventType} onValueChange={handleEventTypeChange}>
            <SelectTrigger className="w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500">
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single Day Event</SelectItem>
              <SelectItem value="multiple">Multiple Day Event</SelectItem>
            </SelectContent>
          </Select>
          {errors.eventType && (
            <p className="text-sm text-red-500">{errors.eventType.message}</p>
          )}
        </div>
      </div>

      {/* Date Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal border-gray-200",
                  !startDate && "text-gray-500",
                  "hover:bg-purple-50 hover:border-purple-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                {startDate ? (
                  format(startDate, "PPP")
                ) : (
                  <span>Pick start date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleStartDateChange}
                disabled={(date: Date) => date < new Date()}
                captionLayout="dropdown-years"
                defaultMonth={startDate || new Date()}
                className="rounded-lg border-purple-100"
              />
            </PopoverContent>
          </Popover>
          {errors.startDate && (
            <p className="text-sm text-red-500">{errors.startDate.message}</p>
          )}
        </div>

        {eventType === "multiple" && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-gray-200",
                    !endDate && "text-gray-500",
                    "hover:bg-purple-50 hover:border-purple-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                  {endDate ? (
                    format(endDate, "PPP")
                  ) : (
                    <span>Pick end date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date: Date | undefined) =>
                    date && setValue("endDate", date)
                  }
                  disabled={(date: Date) =>
                    date < new Date() || (startDate && date < startDate)
                  }
                  captionLayout="dropdown-years"
                  defaultMonth={endDate || startDate || new Date()}
                  className="rounded-lg border-purple-100"
                />
              </PopoverContent>
            </Popover>
            {errors.endDate && (
              <p className="text-sm text-red-500">{errors.endDate.message}</p>
            )}
          </div>
        )}
      </div>

      {/* Location Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="venue"
            className="block text-sm font-medium text-gray-700"
          >
            Venue
          </label>
          <Input
            id="venue"
            type="text"
            {...register("venue")}
            placeholder="Enter venue"
            className="w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500"
          />
          {errors.venue && (
            <p className="text-sm text-red-500">{errors.venue.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700"
          >
            Country
          </label>
          <Input
            id="country"
            type="text"
            {...register("country")}
            placeholder="Enter country"
            className="w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500"
          />
          {errors.country && (
            <p className="text-sm text-red-500">{errors.country.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700"
          >
            City
          </label>
          <Input
            id="city"
            type="text"
            {...register("city")}
            placeholder="Enter city"
            className="w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500"
          />
          {errors.city && (
            <p className="text-sm text-red-500">{errors.city.message}</p>
          )}
        </div>
      </div>

      {/* Capacity and Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="maxCapacity"
            className="block text-sm font-medium text-gray-700"
          >
            Max Capacity
          </label>
          <Input
            id="maxCapacity"
            type="number"
            {...register("maxCapacity", { valueAsNumber: true })}
            placeholder="Enter max capacity"
            min="1"
            className="w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500"
          />
          {errors.maxCapacity && (
            <p className="text-sm text-red-500">{errors.maxCapacity.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price ($)
          </label>
          <Input
            id="price"
            type="number"
            {...register("price", { valueAsNumber: true })}
            placeholder="Enter price"
            min="0"
            step="0.01"
            className="w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500"
          />
          {errors.price && (
            <p className="text-sm text-red-500">{errors.price.message}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Enter event description..."
          rows={4}
          className="w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500"
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white font-medium py-2.5"
        disabled={createEvent.isPending}
      >
        {createEvent.isPending ? "Creating..." : "Create Event"}
      </Button>
    </form>
  );
}
