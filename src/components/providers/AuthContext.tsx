"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User } from "@/lib/api/types";
import { authApi } from "@/lib/api/auth";
import { AUTH_TOKEN_KEY } from "@/lib/api/shared";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: string, propertyType: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        try {
          const userData = await authApi.getMe();
          // Normalize user data (backend uses snake_case, frontend uses camelCase)
          const normalizedUser: User = {
            id: userData.id,
            email: userData.email,
            phone: userData.phone,
            name: userData.name || (userData as any).full_name || (userData as any).fullName || userData.email.split("@")[0],
            roles: (userData as any).roles || [],
            role: ((userData as any).roles?.[0] || (userData as any).role || "user").toLowerCase(),
            organizationId: userData.organizationId || (userData as any).organization_id,
            propertyType: (userData as any).property_type || (userData as any).propertyType,
            status: userData.status,
          };
          setUser(normalizedUser);
        } catch (error) {
          console.error("Failed to load user:", error);
          localStorage.removeItem(AUTH_TOKEN_KEY);
          localStorage.removeItem("auth_refresh_token");
        }
      }
      setIsLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(email, password);

      localStorage.setItem(AUTH_TOKEN_KEY, response.accessToken);
      localStorage.setItem("auth_refresh_token", response.refreshToken);
      
      const userData = response.user;
      const normalizedUser: User = {
        id: userData.id,
        email: userData.email,
        phone: userData.phone,
        name: userData.name || (userData as any).full_name || (userData as any).fullName || userData.email.split("@")[0],
        roles: (userData as any).roles || [],
        role: ((userData as any).roles?.[0] || (userData as any).role || "user").toLowerCase(),
        organizationId: userData.organizationId || (userData as any).organization_id,
        propertyType: (userData as any).property_type || (userData as any).propertyType,
        status: userData.status,
      };
      setUser(normalizedUser);
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: string, propertyType: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(email, password, name, role, propertyType);

      localStorage.setItem(AUTH_TOKEN_KEY, response.accessToken);
      localStorage.setItem("auth_refresh_token", response.refreshToken);
      
      const userData = response.user;
      const normalizedUser: User = {
        id: userData.id,
        email: userData.email,
        phone: userData.phone,
        name: userData.name || (userData as any).full_name || (userData as any).fullName || userData.email.split("@")[0],
        roles: (userData as any).roles || [],
        role: ((userData as any).roles?.[0] || (userData as any).role || "user").toLowerCase(),
        organizationId: userData.organizationId || (userData as any).organization_id,
        propertyType: (userData as any).property_type || (userData as any).propertyType,
        status: userData.status,
      };

      setUser(normalizedUser);
    } catch (error: any) {
      throw new Error(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem("auth_refresh_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: user !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
