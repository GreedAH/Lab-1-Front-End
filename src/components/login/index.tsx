import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useLocation } from "react-router-dom";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { useLogin } from "@/hooks/mutations/auth/useLogin";
import { useUser } from "@/contexts/UserContext";
import Logo from "../shared/logo";

function LogIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: login, isPending: isLoggingIn } = useLogin();
  const { user, setUser, setAccessToken, setRefreshToken } = useUser();

  const onSubmit = async (data: LoginFormData) => {
    login(data, {
      onSuccess: (response) => {
        setUser(response.user);
        setAccessToken(response.accessToken);
        setRefreshToken(response.refreshToken);
        reset();
        navigate(from, { replace: true });
      },
      onError: (error) => {
        console.error("Login failed:", error);
      },
    });
  };

  if (user) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  return (
    <div className="flex w-screen h-screen">
      {/* Left Section - Gradient Background */}
      <div className="w-1/2 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
        <h1 className="text-white text-5xl font-bold text-center leading-tight tracking-tight">
          A Place
          <br />
          for the Youth
        </h1>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-[400px] max-w-full">
          <div className="mb-8">
            <Logo />
            <h2 className="text-3xl font-bold text-gray-900 mb-2 mt-5">
              Welcome back
            </h2>
            <div className="text-gray-600 flex items-center gap-2 flex-wrap">
              <span>Enter your credentials to access your account</span>
              <span className="mx-2 text-gray-300">|</span>
              <span>No Account. Just sign up to join the fun.</span>
              <Button
                type="button"
                variant="ghost"
                className="px-2 py-0 h-auto text-purple-600"
                onClick={() => navigate("/sign-up")}
              >
                Sign up
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
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

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="w-full"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-2.5"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Logging in..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LogIn;
