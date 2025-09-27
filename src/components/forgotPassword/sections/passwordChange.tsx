import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForgotPassword } from "@/hooks/mutations/auth/useForgotPassword";
import { useNavigate } from "react-router-dom";
import {
  passwordChangeSchema,
  type PasswordChangeFormData,
} from "@/lib/validations/auth";

interface UserSummary {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface Props {
  user: UserSummary;
  onSuccess: () => void;
}

const PasswordChange = ({ user, onSuccess }: Props) => {
  const mutation = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const navigate = useNavigate();

  const onSubmit = (data: PasswordChangeFormData) => {
    mutation.mutate(
      { id: user.id, password: data.password },
      {
        onSuccess: () => {
          onSuccess();
          navigate("/login", { replace: true });
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Change password
        </h2>
        <p className="text-gray-600">Set a new password for your account.</p>
      </div>

      <div className="text-sm">
        <div>
          <strong>First name:</strong> {user.firstName}
        </div>
        <div>
          <strong>Last name:</strong> {user.lastName}
        </div>
        <div>
          <strong>Email:</strong> {user.email}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          New password
        </label>
        <Input
          id="password"
          type="password"
          className="w-full"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-gray-700"
        >
          Confirm password
        </label>
        <Input
          id="confirmPassword"
          type="password"
          className="w-full"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-2.5"
        disabled={mutation.isPending ?? false}
      >
        {mutation.isPending ? "Updating..." : "Update password"}
      </Button>
    </form>
  );
};

export default PasswordChange;
