import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  NavigationMenu,
  // NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  // NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/mutations/auth/useLogout";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Role } from "@/types/enums";

export function Navigation() {
  const navigate = useNavigate();
  const { user, clearAuth, refreshToken } = useUser();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Check if user has SUPER_ADMIN role
  const isSuperAdmin = user?.role === Role.SUPER_ADMIN;

  // Navigation items for SUPER_ADMIN
  const superAdminNavItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Create Super Admin",
      href: "/admin/users/create",
    },
    {
      label: "Create Admin",
      href: "/admin/create",
    },
    {
      label: "Manage Users",
      href: "/admin/users",
    },
  ];

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

  const handleNavigation = (href: string) => {
    navigate(href);
    setIsSheetOpen(false);
  };

  // Desktop Navigation Items Component
  const DesktopNavItems = () => (
    <NavigationMenu>
      <NavigationMenuList>
        {/* SUPER_ADMIN specific navigation */}
        {isSuperAdmin && (
          <>
            {superAdminNavItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink
                  className="bg-white/10 text-white hover:bg-white/20 px-4 py-2 rounded-md cursor-pointer"
                  onClick={() => handleNavigation(item.href)}
                >
                  {item.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );

  // Mobile Navigation Items Component
  const MobileNavItems = () => (
    <div className="flex flex-col gap-4">
      {/* SUPER_ADMIN specific navigation */}
      {isSuperAdmin && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Admin Panel
          </h3>
          <div className="space-y-2">
            {superAdminNavItems.map((item) => (
              <button
                key={item.href}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => handleNavigation(item.href)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 shadow-lg" />

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-4">
          {isSuperAdmin && <DesktopNavItems />}

          {/* Auth Button */}
          <Button
            onClick={handleAuthAction}
            className="bg-white text-purple-600 hover:bg-white/90"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging out..." : user ? "Log out" : "Sign in"}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex items-center gap-4">
          {/* Auth Button */}
          <Button
            onClick={handleAuthAction}
            className="bg-white text-purple-600 hover:bg-white/90"
            disabled={isLoggingOut}
            size="sm"
          >
            {isLoggingOut ? "Logging out..." : user ? "Log out" : "Sign in"}
          </Button>

          {/* Mobile Menu Sheet - Only show for SUPER_ADMIN */}
          {isSuperAdmin && (
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-white/10 text-white hover:bg-white/20"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="text-left">Admin Panel</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <MobileNavItems />
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </div>
  );
}
