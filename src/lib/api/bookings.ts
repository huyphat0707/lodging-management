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
  getBookings: async (propertyId?: string): Promise<Booking[]> => {
    const url = propertyId ? `/bookings?propertyId=${propertyId}` : "/bookings";
    return api.get<Booking[]>(url);
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
