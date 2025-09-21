import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "@/api/users";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      // Invalidate and refetch user queries
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
