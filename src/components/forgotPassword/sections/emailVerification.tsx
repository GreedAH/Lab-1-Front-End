import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useFindUserByEmail } from "@/hooks/mutations/users/useFindUserByEmail";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { User } from "@/api/users";
import {
  forgotEmailSchema,
  type ForgotEmailFormData,
} from "@/lib/validations/auth";

interface Props {
  onFoundUser: (user: User) => void;
}

const EmailVerification = ({ onFoundUser }: Props) => {
  const findUser = useFindUserByEmail();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotEmailFormData>({
    resolver: zodResolver(forgotEmailSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: ForgotEmailFormData) => {
    findUser.mutate(data.email, {
      onSuccess: (res) => onFoundUser(res as User),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Forgot password
        </h2>
        <p className="text-gray-600">
          Enter the email for your account to find it.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          className="w-full"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-2.5"
      >
        Find account
      </Button>
    </form>
  );
};

export default EmailVerification;
