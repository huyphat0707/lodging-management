import { api } from "./shared";
import { Service, ServiceType } from "./types";

export interface CreateServiceDto {
  name: string;
  type?: ServiceType;
  description?: string;
  price: string;
  isActive?: boolean;
  propertyId: string;
}

export const servicesApi = {
  getServices: async (propertyId?: string): Promise<{ data: Service[]; total: number }> => {
    const url = propertyId ? `/services?propertyId=${propertyId}` : "/services";
    return api.get<{ data: Service[]; total: number }>(url);
  },

  getServiceById: async (id: string): Promise<Service> => {
    return api.get<Service>(`/services/${id}`);
  },

  createService: async (data: CreateServiceDto): Promise<Service> => {
    return api.post<Service>("/services", data);
  },

  updateService: async (id: string, data: Partial<CreateServiceDto>): Promise<Service> => {
    return api.patch<Service>(`/services/${id}`, data);
  },

  deleteService: async (id: string): Promise<void> => {
    return api.delete(`/services/${id}`);
  },
};
