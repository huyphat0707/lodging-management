import { api } from "./shared";
import type { DashboardStats } from "./types";

export interface RevenueReport {
  startDate: string;
  endDate: string;
  totalRevenue: number;
  byProperty: {
    propertyId: string;
    propertyName: string;
    total: number;
    count: number;
  }[];
}

export const analyticsApi = {
  getOverviewStats: async (): Promise<DashboardStats> => {
    return api.get<DashboardStats>("/dashboard/stats");
  },

  getRevenueReport: async (startDate?: string, endDate?: string): Promise<RevenueReport> => {
    let url = "/dashboard/reports/revenue";
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (params.toString()) url += `?${params.toString()}`;
    
    return api.get<RevenueReport>(url);
  },
};
