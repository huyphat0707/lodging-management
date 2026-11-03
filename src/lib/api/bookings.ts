import { api } from "./shared";
import type { Booking, BookingStatus } from "./types";

export interface CreateBookingDto {
  guestName: string;
  roomId: string;
  propertyId: string;
  checkIn: string;
  checkOut: string;
  status?: BookingStatus;
  amount?: number;
}

export const bookingsApi = {
  getBookings: async (params?: { page?: number; limit?: number; propertyId?: string; status?: string; search?: string }): Promise<{ data: Booking[]; total: number }> => {
    const searchParams = new URLSearchParams();
    if (params) {
      if (params.page !== undefined) searchParams.append("page", String(params.page));
      if (params.limit !== undefined) searchParams.append("limit", String(params.limit));
      if (params.propertyId !== undefined) searchParams.append("propertyId", String(params.propertyId));
      if (params.status !== undefined) searchParams.append("status", String(params.status));
      if (params.search !== undefined) searchParams.append("search", String(params.search));
    }
    const queryStr = searchParams.toString();
    const url = queryStr ? `/bookings?${queryStr}` : "/bookings";
    return api.get<{ data: Booking[]; total: number }>(url);
  },

  getBookingById: async (id: string): Promise<Booking> => {
    return api.get<Booking>(`/bookings/${id}`);
  },

  createBooking: async (data: CreateBookingDto): Promise<Booking> => {
    return api.post<Booking>("/bookings", data);
  },

  updateBooking: async (id: string, data: Partial<CreateBookingDto>): Promise<Booking> => {
    return api.patch<Booking>(`/bookings/${id}`, data);
  },

  deleteBooking: async (id: string): Promise<void> => {
    return api.delete(`/bookings/${id}`);
  },

  updateBookingStatus: async (id: string, status: BookingStatus): Promise<Booking> => {
    return api.patch<Booking>(`/bookings/${id}/status`, { status });
  },
};
