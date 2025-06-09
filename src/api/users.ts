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

export const updateUser = (id: number, data: Partial<UserCreateInput>) =>
  api<User>(`/users/${id}`, {
    method: "PUT",
    data,
  });

export const deleteUser = (id: number) =>
  api(`/users/${id}`, {
    method: "DELETE",
  });
