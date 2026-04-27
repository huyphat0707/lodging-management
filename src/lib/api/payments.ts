import { api } from "./shared";
import type { Payment, PaymentStatus } from "./types";

export interface CreatePaymentDto {
  invoiceId: string;
  amount: number;
  method?: "Cash" | "BankTransfer" | "MoMo" | "VNPay" | "Other";
  status?: PaymentStatus;
  transactionId?: string;
  paymentDate?: string;
  notes?: string;
}

export const paymentsApi = {
  getPayments: async (invoiceId?: string): Promise<Payment[]> => {
    const url = invoiceId ? `/payments?invoiceId=${invoiceId}` : "/payments";
    return api.get<Payment[]>(url);
  },

  getPaymentById: async (id: string): Promise<Payment> => {
    return api.get<Payment>(`/payments/${id}`);
  },

  createPayment: async (data: CreatePaymentDto): Promise<Payment> => {
    return api.post<Payment>("/payments", data);
  },

  updatePayment: async (id: string, data: Partial<CreatePaymentDto>): Promise<Payment> => {
    return api.patch<Payment>(`/payments/${id}`, data);
  },

  deletePayment: async (id: string): Promise<void> => {
    return api.delete(`/payments/${id}`);
  },
};
