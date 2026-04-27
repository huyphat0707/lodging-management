import { User, Property, Room, Tenant, Booking, Contract, Service, OperationalTask, DashboardStats, Payment } from "./types";

export const users: User[] = [
  { 
    id: "1", 
    name: "Admin", 
    email: "admin@hypstay.com", 
    phone: "0900000001",
    role: "Admin", 
    status: "Active",
    createdAt: new Date().toISOString()
  },
  { 
    id: "2", 
    name: "Manager", 
    email: "manager@hypstay.com", 
    phone: "0900000002",
    role: "PropertyOwner", 
    status: "Active",
    createdAt: new Date().toISOString()
  },
];

export const properties: Property[] = [
  { 
    id: "1", 
    name: "HypStay Central", 
    address: "123 Main St", 
    type: "Hotel", 
    totalRooms: 10, 
    status: "Active",
    bookingsSummary: "85% occupied"
  },
  { 
    id: "2", 
    name: "Student Home A", 
    address: "456 University Ave", 
    type: "Boarding", 
    totalRooms: 20, 
    status: "Active",
    bookingsSummary: "100% occupied"
  },
];

export const rooms: Room[] = [
  { 
    id: "1", 
    propertyId: "1", 
    roomNumber: "101", 
    type: "Single", 
    price: "500.000", 
    status: "Available",
    tenant: ""
  },
  { 
    id: "2", 
    propertyId: "1", 
    roomNumber: "102", 
    type: "Double", 
    price: "800.000", 
    status: "Occupied",
    tenant: "Nguyen Van A"
  },
];

export const tenants: Tenant[] = [
  { 
    id: "1", 
    name: "Nguyen Van A", 
    room: "102",
    phone: "0901234567", 
    status: "Active",
    moveInDate: "2024-01-01"
  },
];

export const bookings: Booking[] = [];
export const contracts: Contract[] = [];
export const services: Service[] = [];
export const tasks: OperationalTask[] = [];
export const payments: Payment[] = [];

export const dashboardStats: DashboardStats = {
  revenue: {
    total: 15000000,
    trend: 12
  },
  rooms: {
    total: 30,
    occupied: 10,
    available: 18,
    maintenance: 2
  },
  tenants: {
    active: 10,
    newThisMonth: 2
  },
  tasks: {
    pending: 5,
    completed: 10
  },
  recentActivity: []
};
