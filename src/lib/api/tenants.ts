import { api } from "./shared";
import type { Tenant, PaginatedResponse } from "./types";

export interface CreateTenantDto {
  name: string;
  phone: string;
  email?: string;
  cccd?: string;
  birthday?: string;
  hometown?: string;
  job?: string;
  status: "Active" | "Pending" | "Inactive";
  moveInDate?: string;
  propertyId: string;
}

export const tenantsApi = {
  getTenants: async (filters: any = {}): Promise<PaginatedResponse<Tenant>> => {
    let url = "/tenants";
    const params = new URLSearchParams();
    if (filters.propertyId) params.append("propertyId", filters.propertyId);
    if (filters.status) params.append("status", filters.status);
    if (filters.search) params.append("search", filters.search);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    
    if (params.toString()) url += `?${params.toString()}`;
    return api.get(url);
  },

  getTenantById: async (id: string): Promise<Tenant> => {
    return api.get<Tenant>(`/tenants/${id}`);
  },

  createTenant: async (data: CreateTenantDto): Promise<Tenant> => {
    return api.post<Tenant>("/tenants", data);
  },

  updateTenant: async (id: string, data: Partial<CreateTenantDto>): Promise<Tenant> => {
    return api.patch<Tenant>(`/tenants/${id}`, data);
  },

  deleteTenant: async (id: string): Promise<void> => {
    return api.delete(`/tenants/${id}`);
  },
};
