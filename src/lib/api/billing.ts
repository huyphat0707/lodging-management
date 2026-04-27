import { api } from "./shared";
import type { Invoice } from "./types";

export interface CreateInvoiceDto {
  invoiceNumber: string;
  tenantId: string;
  roomId: string;
  propertyId: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount?: number;
  status?: "Paid" | "Pending" | "Overdue";
  notes?: string;
}

export const billingApi = {
  getInvoices: async (filters: any = {}): Promise<{ data: Invoice[]; total: number }> => {
    let url = "/invoices";
    const params = new URLSearchParams();
    if (filters.propertyId) params.append("propertyId", filters.propertyId);
    if (filters.status) params.append("status", filters.status);
    if (filters.search) params.append("search", filters.search);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    
    if (params.toString()) url += `?${params.toString()}`;
    return api.get(url);
  },

  getInvoiceById: async (id: string): Promise<Invoice> => {
    return api.get(`/invoices/${id}`);
  },

  createInvoice: async (data: any): Promise<Invoice> => {
    return api.post("/invoices", data);
  },

  updateInvoice: async (id: string, data: any): Promise<Invoice> => {
    return api.patch(`/invoices/${id}`, data);
  },

  generateInvoices: async (propertyId: string, month: string): Promise<{ success: boolean; count: number }> => {
    return api.post("/invoices/generate", { propertyId, month });
  },

  updateMeterReadings: async (
    id: string, 
    readings: { elecOld: number; elecNew: number; waterOld: number; waterNew: number }
  ): Promise<Invoice> => {
    return api.patch(`/invoices/${id}/meter-readings`, readings);
  },

  updateInvoiceStatus: async (id: string, status: string): Promise<Invoice> => {
    return api.patch(`/invoices/${id}/status`, { status });
  },

  deleteInvoice: async (id: string): Promise<void> => {
    return api.delete(`/invoices/${id}`);
  },
};
