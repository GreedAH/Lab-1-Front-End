import { api } from "@/lib/api";
import { Role } from "@/types/enums";

export interface UserCreateInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthday: string;
  role: Role;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthday: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export const createUser = (data: UserCreateInput) =>
  api<User>("/users", {
    method: "POST",
    data,
  });

export const getAllUsers = () =>
  api<User[]>("/users", {
    method: "GET",
  });

export const getUserById = (id: number) =>
  api<User>(`/users/${id}`, {
    method: "GET",
  });

export const deleteUser = (id: number) =>
  api<{
    message: string;
    user: Pick<User, "id" | "firstName" | "lastName" | "email">;
  }>(`/users/${id}`, {
    method: "DELETE",
    requiresAuth: true,
  });

export const getUsersByRole = (role: Role) =>
  api<User[]>(`/users?role=${role}`, {
    method: "GET",
    requiresAuth: true,
  });

export interface UserUpdateInput {
  firstName: string;
  lastName: string;
  email: string;
}

export const updateUser = (id: number, data: UserUpdateInput) =>
  api<User>(`/users/${id}`, {
    method: "PUT",
    data,
    requiresAuth: true,
  });
