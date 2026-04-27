import { api } from "./shared";
import type { User } from "./types";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User & { organizationId: string };
}

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    return api.post<LoginResponse>("/auth/login", { email, password });
  },

  register: async (email: string, password: string, name: string): Promise<LoginResponse> => {
    return api.post<LoginResponse>("/auth/register", {
      email,
      password,
      name,
      // Defaulting role and status as backend handles them or requires them in DTO
      role: "PropertyOwner",
      status: "Active",
    });
  },

  getMe: async (): Promise<User & { organizationId: string }> => {
    return api.get<User & { organizationId: string }>("/auth/me");
  },

  refreshToken: async (token: string): Promise<{ accessToken: string }> => {
    return api.post<{ accessToken: string }>("/auth/refresh", { refreshToken: token });
  },
};
