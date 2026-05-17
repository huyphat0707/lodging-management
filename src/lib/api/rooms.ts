import { api } from "./shared";
import type { Room, PaginatedResponse } from "./types";

export interface CreateRoomDto {
  roomNumber: string;
  type: string;
  price: string;
  status: "Occupied" | "Available" | "Maintenance";
  propertyId: string;
  electricityPrice?: string;
  waterPrice?: string;
  note?: string;
}

export const roomsApi = {
  getRooms: async (filters: any = {}): Promise<PaginatedResponse<Room>> => {
    let url = "/rooms";
    const params = new URLSearchParams();
    if (filters.propertyId) params.append("propertyId", filters.propertyId);
    if (filters.status) params.append("status", filters.status);
    if (filters.search) params.append("search", filters.search);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    
    if (params.toString()) url += `?${params.toString()}`;
    return api.get(url);
  },

  getRoomById: async (id: string): Promise<Room> => {
    return api.get<Room>(`/rooms/${id}`);
  },

  createRoom: async (data: CreateRoomDto): Promise<Room> => {
    return api.post<Room>("/rooms", data);
  },

  updateRoom: async (id: string, data: Partial<CreateRoomDto>): Promise<Room> => {
    return api.patch<Room>(`/rooms/${id}`, data);
  },

  deleteRoom: async (id: string): Promise<void> => {
    return api.delete(`/rooms/${id}`);
  },
};
