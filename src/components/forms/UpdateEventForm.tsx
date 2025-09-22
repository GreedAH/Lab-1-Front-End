import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUpdateEvent } from "@/hooks/mutations/events/useUpdateEvent";
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
import { useEffect, useMemo } from "react";
import { EventStatus } from "@/types/enums";
import { useGetEventById } from "@/hooks/queries/events/useGetEventById";
import type { EventUpdateInput } from "@/api/events";
import { useNavigate } from "react-router-dom";

const updateEventFormSchema = z.object({
  name: z
    .string()
    .min(2, "Event name must be at least 2 characters")
    .optional(),
  eventType: z.enum(["single", "multiple"]).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  venue: z.string().min(2, "Venue must be at least 2 characters").optional(),
  country: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .optional(),
  city: z.string().min(2, "City must be at least 2 characters").optional(),
  maxCapacity: z
    .number()
    .min(1, "Max capacity must be at least 1")
    .int("Max capacity must be a whole number")
    .optional(),
  price: z.number().min(0, "Price cannot be negative").optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .optional(),
  status: z.nativeEnum(EventStatus).optional(),
});

type UpdateEventFormValues = z.infer<typeof updateEventFormSchema>;

export function UpdateEventForm({ eventId }: { eventId: number }) {
  const mutateUpdate = useUpdateEvent();
  const navigate = useNavigate();

  const statusOptions = useMemo(
    () => [
      { label: "Open", value: EventStatus.OPEN },
      { label: "Ongoing", value: EventStatus.ONGOING },
      { label: "Cancelled", value: EventStatus.CANCELLED },
      { label: "Done", value: EventStatus.DONE },
    ],
    []
  );

  const {
    data: event,
    isLoading,
    error: eventError,
  } = useGetEventById(eventId, { enabled: !!eventId });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
    control,
  } = useForm<UpdateEventFormValues>({
    resolver: zodResolver(updateEventFormSchema),
    defaultValues: {},
  });

  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const eventType = watch("eventType");

  // Reset form when event data is loaded
  useEffect(() => {
    if (event) {
      const start = event.startDate ? new Date(event.startDate) : undefined;
      const end = event.endDate ? new Date(event.endDate) : undefined;

      // Determine event type based on dates
      const isMultiple = start && end && start.getTime() !== end.getTime();

      reset({
        name: event.name,
        description: event.description,
        venue: event.venue,
        country: event.country,
        city: event.city,
        maxCapacity: event.maxCapacity,
        price: event.price,
        status: event.status,
        eventType: isMultiple ? "multiple" : "single",
        startDate: start,
        endDate: end,
      });
    }
  }, [event, reset]);

  const onSubmit = async (data: UpdateEventFormValues) => {
    try {
      const payload: Partial<EventUpdateInput> = {
        ...data,
      } as Partial<EventUpdateInput>;
      if (data.startDate)
        payload.startDate = format(data.startDate, "yyyy-MM-dd");
      if (data.endDate) payload.endDate = format(data.endDate, "yyyy-MM-dd");

      await mutateUpdate.mutateAsync({ id: eventId, data: payload });
      toast.success("Event updated successfully");
      navigate("/events");
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.message || "Failed to update event");
    }
  };

  const handleEventTypeChange = (value: "single" | "multiple") => {
    setValue("eventType", value);

    // If switching to single day, set endDate to startDate
    if (value === "single" && startDate) {
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

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading event data...</p>
      </div>
    );
  }

  if (eventError || !event) {
    return (
      <div className="text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Event Not Found
          </h3>
          <p className="text-red-600">
            The event you're trying to edit could not be found.
          </p>
        </div>
      </div>
    );
  }

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
          <Controller
            name="eventType"
            control={control}
            render={({ field }) => (
              <Select
                value={!isLoading ? field.value || "" : ""}
                onValueChange={(value) => {
                  field.onChange(value);
                  handleEventTypeChange(value as "single" | "multiple");
                }}
                key={!isLoading ? field.value || "" : ""}
              >
                <SelectTrigger className="w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Day Event</SelectItem>
                  <SelectItem value="multiple">Multiple Day Event</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.eventType && (
            <p className="text-sm text-red-500">{errors.eventType.message}</p>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              value={!isLoading ? field.value || "" : ""}
              onValueChange={field.onChange}
              key={!isLoading ? field.value || "" : ""}
            >
              <SelectTrigger className="w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.status && (
          <p className="text-sm text-red-500">
            {errors.status.message as string}
          </p>
        )}
      </div>

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
            <p className="text-sm text-red-500">
              {errors.startDate.message as string}
            </p>
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
                    date < new Date() || (!!startDate && date < startDate)
                  }
                  captionLayout="dropdown-years"
                  defaultMonth={endDate || startDate || new Date()}
                  className="rounded-lg border-purple-100"
                />
              </PopoverContent>
            </Popover>
            {errors.endDate && (
              <p className="text-sm text-red-500">
                {errors.endDate.message as string}
              </p>
            )}
          </div>
        )}
      </div>

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
            placeholder="Update venue"
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
            placeholder="Update country"
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
            placeholder="Update city"
            className="w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500"
          />
          {errors.city && (
            <p className="text-sm text-red-500">{errors.city.message}</p>
          )}
        </div>
      </div>

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
            placeholder="Update max capacity"
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
            placeholder="Update price"
            min="0"
            step="0.01"
            className="w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500"
          />
          {errors.price && (
            <p className="text-sm text-red-500">{errors.price.message}</p>
          )}
        </div>
      </div>

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
          placeholder="Update description..."
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
        disabled={mutateUpdate.isPending}
      >
        {mutateUpdate.isPending ? "Updating..." : "Update Event"}
      </Button>
    </form>
  );
}
