import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/api/auth";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: ({ id, password }: { id: number; password: string }) =>
      forgotPassword(id, password),
  });
};
