import { useNavigate } from "react-router-dom";
import { useState } from "react";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Role } from "@/types/enums";
import { Logo } from "@/components/shared/logo";
import { navigationItems, type NavParentItem } from "@/utils/navigationItems";

export function Navigation() {
  const navigate = useNavigate();
  const { user, clearAuth, refreshToken } = useUser();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Role helpers are handled via getRoleNavItems

  const getRoleNavItems = (): NavParentItem[] => {
    if (user?.role === Role.SUPER_ADMIN) return navigationItems.SUPER_ADMIN;
    if (user?.role === Role.ADMIN) return navigationItems.ADMIN;
    return [];
  };

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
        {getRoleNavItems().map((parent) => (
          <NavigationMenuItem key={parent.label}>
            <NavigationMenuTrigger className="bg-white/10 text-white hover:bg-white/20">
              {parent.label}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="p-4 grid gap-2 min-w-[220px]">
                {parent.children.map((child) => (
                  <NavigationMenuLink
                    key={child.href}
                    className="px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleNavigation(child.href)}
                  >
                    {child.label}
                  </NavigationMenuLink>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );

  // Mobile Navigation Items Component
  const MobileNavItems = () => (
    <div className="flex flex-col gap-4">
      {getRoleNavItems().map((parent) => (
        <div key={parent.label}>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            {parent.label}
          </h3>
          <div className="space-y-2">
            {parent.children.map((child) => (
              <button
                key={child.href}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => handleNavigation(child.href)}
              >
                {child.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-4">
          <DesktopNavItems />

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
          {getRoleNavItems().length > 0 && (
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
