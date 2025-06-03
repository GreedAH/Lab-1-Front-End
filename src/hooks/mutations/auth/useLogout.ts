import { useMutation } from "@tanstack/react-query";
import { logout } from "@/api/auth";

export const useLogout = () =>
  useMutation({
    mutationFn: (refreshToken: string) => logout(refreshToken),
  });
