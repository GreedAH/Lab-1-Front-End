import { useMutation } from "@tanstack/react-query";
import { createUser, type UserCreateInput } from "@/api/users";

export const useCreateUser = () =>
  useMutation({
    mutationFn: (data: UserCreateInput) => createUser(data),
  });
