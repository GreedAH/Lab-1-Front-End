import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useLogout } from "@/hooks/mutations/auth/useLogout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function Dashboard() {
  const navigate = useNavigate();
  const { user, clearAuth, refreshToken } = useUser();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const handleLogout = () => {
    if (refreshToken) {
      logout(refreshToken, {
        onSuccess: () => {
          clearAuth();
          navigate("/login");
        },
        onError: (error) => {
          console.error("Logout failed:", error);
          // Still clear the auth state even if the API call fails
          clearAuth();
          navigate("/login");
        },
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>Welcome back, {user?.email}!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500">
            You are logged in as a {user?.role} user.
          </p>
          <Button
            onClick={handleLogout}
            className="w-full"
            variant="outline"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
