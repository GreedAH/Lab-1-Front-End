import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateUser } from "@/hooks/mutations/users/useCreateUser";
import { toast } from "sonner";
import type { ApiError } from "@/lib/api";
import { Role } from "@/types/enums";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

const userFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  birthday: z.date({
    required_error: "Please select a date",
  }),
});

type UserFormValues = z.infer<typeof userFormSchema>;

export function CreateAdminForm() {
  const createUser = useCreateUser();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const birthday = watch("birthday");

  const onSubmit = async (data: UserFormValues) => {
    try {
      await createUser.mutateAsync({
        ...data,
        role: Role.ADMIN,
        birthday: format(data.birthday, "yyyy-MM-dd"),
      });
      toast.success("Admin created successfully");
      reset();
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.message || "Failed to create Admin");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <Input
            id="firstName"
            type="text"
            {...register("firstName")}
            placeholder="John"
            className="w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500"
          />
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <Input
            id="lastName"
            type="text"
            {...register("lastName")}
            placeholder="Doe"
            className="w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500"
          />
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="john.doe@example.com"
          className="w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500"
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <Input
          id="password"
          type="password"
          {...register("password")}
          placeholder="********"
          className="w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500"
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Birthday
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal border-gray-200",
                !birthday && "text-gray-500",
                "hover:bg-purple-50 hover:border-purple-500"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
              {birthday ? format(birthday, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={birthday}
              onSelect={(date: Date | undefined) =>
                date && setValue("birthday", date)
              }
              disabled={(date: Date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              captionLayout="dropdown-years"
              defaultMonth={birthday || new Date(1990, 0)}
              className="rounded-lg border-purple-100"
            />
          </PopoverContent>
        </Popover>
        {errors.birthday && (
          <p className="text-sm text-red-500">{errors.birthday.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white font-medium py-2.5"
        disabled={createUser.isPending}
      >
        {createUser.isPending ? "Creating..." : "Create Admin"}
      </Button>
    </form>
  );
}
