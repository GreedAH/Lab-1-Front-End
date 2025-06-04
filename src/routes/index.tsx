import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "@/config/routes";

// Create router with configured routes
const router = createBrowserRouter(routes);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
