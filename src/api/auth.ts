import { api } from "@/lib/api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  role: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export const login = (credentials: LoginCredentials) =>
  api<LoginResponse>("/auth/login", {
    method: "POST",
    data: credentials,
  });

export const logout = (refreshToken: string) =>
  api("/auth/logout", {
    method: "POST",
    data: { refreshToken },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

export const refreshToken = (token: string) =>
  api<RefreshTokenResponse>("/auth/refresh-token", {
    method: "POST",
    data: { refreshToken: token },
  });

export const forgotPassword = (id: number, password: string) =>
  api(`/auth/forgot-password/${id}`, {
    method: "POST",
    data: { password },
    // no requiresAuth
  });
