import { useMutation } from "@tanstack/react-query";
import { refreshToken } from "@/api/auth";

export const useRefreshToken = () =>
  useMutation({
    mutationFn: (token: string) => refreshToken(token),
  }); 