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
import EditEvent from "@/routes/protected/EditEvent";
import { ClientEventsList } from "@/routes/protected/ClientEventsList";
import { CreateReservation } from "@/routes/protected/CreateReservation";
import { ClientReservationsList } from "@/routes/protected/ClientReservationsList";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useEffect } from "react";

const ReservationsRedirect = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      navigate(`/reservations/${user.id}`, { replace: true });
    }
  }, [user, navigate]);

  return <div />;
};
import { Landing } from "@/routes/public/landing";
import SignUp from "@/components/signUp";
import { EventReservationsList } from "@/routes/protected/EventReservationsList";
import ForgotPassword from "@/components/forgotPassword";

// Public routes - accessible to everyone
export const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/login",
    element: <LogIn />,
  },
  {
    path: "/forget-password",
    element: <ForgotPassword />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
];

// Private routes - require authentication
export const privateRoutes: RouteObject[] = [
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
  {
    path: "/events/:id/edit",
    element: (
      <ProtectedRoute allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN]}>
        <EditEvent />
      </ProtectedRoute>
    ),
  },
  {
    path: "/client/events",
    element: (
      <ProtectedRoute allowedRoles={[Role.CLIENT]}>
        <ClientEventsList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/reserve/:eventId",
    element: (
      <ProtectedRoute allowedRoles={[Role.CLIENT]}>
        <CreateReservation />
      </ProtectedRoute>
    ),
  },
  {
    path: "/reservations",
    element: (
      <ProtectedRoute allowedRoles={[Role.CLIENT]}>
        <ReservationsRedirect />
      </ProtectedRoute>
    ),
  },
  {
    path: "/reservations/:userId",
    element: (
      <ProtectedRoute allowedRoles={[Role.CLIENT]}>
        <ClientReservationsList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/event/reservations/:id",
    element: (
      <ProtectedRoute
        allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN, Role.CLIENT]}
      >
        <EventReservationsList />
      </ProtectedRoute>
    ),
  },
];

// All routes combined
export const routes: RouteObject[] = [...publicRoutes, ...privateRoutes];
