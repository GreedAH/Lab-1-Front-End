import { useMutation } from "@tanstack/react-query";
import { login, type LoginCredentials } from "@/api/auth";

export const useLogin = () =>
  useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
  });
