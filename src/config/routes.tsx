import type { RouteObject } from "react-router-dom";
import LogIn from "@/components/login";
import Dashboard from "@/components/dashboard";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import SuperAdminUserManagement from "@/routes/protected/SuperAdminUserManagement";
import { Role } from "@/types/enums";
import AdminUserManagement from "@/routes/protected/AdminUserManagement";
import AdminUsersList from "@/routes/protected/AdminUsersList";
import EditAdminUser from "@/routes/protected/EditAdminUser";
import { EventManagement } from "@/routes/protected/EventManagement";
import { EventsList } from "@/routes/protected/EventsList";

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
  {
    path: "/admin/create",
    element: (
      <ProtectedRoute allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN]}>
        <AdminUserManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <ProtectedRoute allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN]}>
        <AdminUsersList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/users/:id/edit",
    element: (
      <ProtectedRoute allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN]}>
        <EditAdminUser />
      </ProtectedRoute>
    ),
  },
  {
    path: "/events/create",
    element: (
      <ProtectedRoute allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN]}>
        <EventManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/events",
    element: (
      <ProtectedRoute
        allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN, Role.CLIENT]}
      >
        <EventsList />
      </ProtectedRoute>
    ),
  },
];

// All routes combined
export const routes: RouteObject[] = [...publicRoutes, ...privateRoutes];
