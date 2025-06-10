import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/mutations/auth/useLogout";

export function Navigation() {
  const navigate = useNavigate();
  const { user, clearAuth, refreshToken } = useUser();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const handleAuthAction = () => {
    if (user) {
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
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 shadow-lg" />

        <div className="flex items-center gap-4">
          {/* Navigation Menu */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-white/10 text-white hover:bg-white/20">
                  About Us
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 w-[400px] bg-white rounded-lg">
                    <NavigationMenuLink className="hover:bg-gray-100 p-2 rounded">
                      Our Story
                    </NavigationMenuLink>
                    <NavigationMenuLink className="hover:bg-gray-100 p-2 rounded">
                      Team
                    </NavigationMenuLink>
                    <NavigationMenuLink className="hover:bg-gray-100 p-2 rounded">
                      Mission
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-white/10 text-white hover:bg-white/20">
                  Services
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 w-[400px] bg-white rounded-lg">
                    <NavigationMenuLink className="hover:bg-gray-100 p-2 rounded">
                      Courses
                    </NavigationMenuLink>
                    <NavigationMenuLink className="hover:bg-gray-100 p-2 rounded">
                      Consulting
                    </NavigationMenuLink>
                    <NavigationMenuLink className="hover:bg-gray-100 p-2 rounded">
                      Resources
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  className="bg-white/10 text-white hover:bg-white/20 px-4 py-2 rounded-md"
                  href="/case-studies"
                >
                  Case Studies
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  className="bg-white/10 text-white hover:bg-white/20 px-4 py-2 rounded-md"
                  href="/faq"
                >
                  FAQ
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Auth Button */}
          <Button
            onClick={handleAuthAction}
            className="bg-white text-purple-600 hover:bg-white/90"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging out..." : user ? "Log out" : "Sign in"}
          </Button>
        </div>
      </div>
    </div>
  );
}
