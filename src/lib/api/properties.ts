import { api } from "./shared";
import type { Property, PropertyType, PaginatedResponse } from "./types";

export interface CreatePropertyDto {
  name: string;
  address: string;
  type: PropertyType;
  electricityPrice?: string;
  waterPrice?: string;
  note?: string;
}

export const propertiesApi = {
  getProperties: async (filters: any = {}): Promise<PaginatedResponse<Property>> => {
    let url = "/properties";
    const params = new URLSearchParams();
    if (filters.type) params.append("type", filters.type);
    if (filters.status) params.append("status", filters.status);
    if (filters.search) params.append("search", filters.search);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    
    if (params.toString()) url += `?${params.toString()}`;
    return api.get(url);
  },

  getPropertiesByType: async (type: PropertyType): Promise<PaginatedResponse<Property>> => {
    return propertiesApi.getProperties({ type });
  },

  getPropertyById: async (id: string): Promise<Property> => {
    return api.get<Property>(`/properties/${id}`);
  },

  createProperty: async (data: CreatePropertyDto): Promise<Property> => {
    return api.post<Property>("/properties", data);
  },

  updateProperty: async (id: string, data: Partial<CreatePropertyDto>): Promise<Property> => {
    return api.patch<Property>(`/properties/${id}`, data);
  },

  deleteProperty: async (id: string): Promise<void> => {
    return api.delete(`/properties/${id}`);
  },
};
