import { useMutation } from "@tanstack/react-query";
import { findUserByEmail } from "@/api/users";

export const useFindUserByEmail = () => {
  return useMutation({
    mutationFn: (email: string) => findUserByEmail(email),
  });
};
