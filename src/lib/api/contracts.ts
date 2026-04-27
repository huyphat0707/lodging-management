import { api } from "./shared";
import type { Contract, ContractStatus } from "./types";

export interface CreateContractDto {
  tenantId: string;
  roomId: string;
  propertyId: string;
  startDate: string;
  endDate: string;
  monthlyRate: string;
  depositAmount: string;
  status?: ContractStatus;
  signedDate?: string;
  notes?: string;
}

export const contractsApi = {
  getContracts: async (filters: any = {}): Promise<{ data: Contract[]; total: number }> => {
    let url = "/contracts";
    const params = new URLSearchParams();
    if (filters.propertyId) params.append("propertyId", filters.propertyId);
    if (filters.tenantId) params.append("tenantId", filters.tenantId);
    if (filters.status) params.append("status", filters.status);
    if (filters.search) params.append("search", filters.search);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    
    if (params.toString()) url += `?${params.toString()}`;
    return api.get(url);
  },

  getContractById: async (id: string): Promise<Contract> => {
    return api.get(`/contracts/${id}`);
  },

  createContract: async (data: any): Promise<Contract> => {
    return api.post("/contracts", data);
  },

  updateContract: async (id: string, data: any): Promise<Contract> => {
    return api.patch(`/contracts/${id}`, data);
  },

  deleteContract: async (id: string): Promise<void> => {
    return api.delete(`/contracts/${id}`);
  },

  updateContractStatus: async (id: string, status: ContractStatus): Promise<Contract> => {
    return api.patch(`/contracts/${id}/status`, { status });
  },
};
