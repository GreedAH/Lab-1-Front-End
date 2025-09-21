import { useQuery } from "@tanstack/react-query";
import { getUsersByRole, getAllUsers, getUserById } from "@/api/users";
import { Role } from "@/types/enums";

export const useGetUsersByRole = (role: Role) =>
  useQuery({
    queryKey: ["users", "byRole", role],
    queryFn: () => getUsersByRole(role),
  });

export const useGetAllUsers = () =>
  useQuery({
    queryKey: ["users", "all"],
    queryFn: getAllUsers,
  });

export const useGetUserById = (id: number) =>
  useQuery({
    queryKey: ["users", "byId", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
