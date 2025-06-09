import type { RouteObject } from "react-router-dom";
import LogIn from "@/components/login";
import Dashboard from "@/components/dashboard";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import SuperAdminUserManagement from "@/routes/protected/SuperAdminUserManagement";
import { Role } from "@/types/enums";

// Public routes - accessible to everyone
export const publicRoutes: RouteObject[] = [
  {
    path: "/login",
    element: <LogIn />,
  },
];

// Private routes - require authentication
export const privateRoutes: RouteObject[] = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/users/create",
    element: (
      <ProtectedRoute allowedRoles={[Role.SUPER_ADMIN]}>
        <SuperAdminUserManagement />
      </ProtectedRoute>
    ),
  },
];

// All routes combined
export const routes: RouteObject[] = [...publicRoutes, ...privateRoutes];
