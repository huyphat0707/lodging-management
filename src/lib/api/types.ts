export type Room = {
  id: string;
  roomNumber: string;
  type: string;
  price: string;
  status: "Occupied" | "Available" | "Maintenance";
  tenant: string;
  propertyId: string;
  propertyName?: string;
  electricityPrice?: string;
  waterPrice?: string;
};

export type Tenant = {
  id: string;
  name: string;
  room: string;
  phone: string;
  status: "Active" | "Pending" | "Inactive";
  moveInDate: string;
};

export type InvoiceItemType = "RoomRent" | "Electricity" | "Water" | "Service" | "Other";

export type InvoiceItem = {
  id: string;
  name: string;
  type: InvoiceItemType;
  oldIndex?: number;
  newIndex?: number;
  quantity: number;
  unitPrice: number;
  amount: number;
};

export type InvoiceStatus = "Paid" | "Unpaid" | "PartiallyPaid" | "Overdue" | "Cancelled";

export type Invoice = {
  id: string;
  invoiceNumber: string;
  tenantId: string;
  tenantName: string;
  roomId: string;
  roomNumber: string;
  propertyId: string;
  propertyName: string;
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
  issueDate: string;
  status: InvoiceStatus;
  electricityOldIndex?: number;
  electricityNewIndex?: number;
  waterOldIndex?: number;
  waterNewIndex?: number;
  items: InvoiceItem[];
};

export type PropertyType = "Boarding" | "Hotel" | "Homestay";

export type PropertyStatus = "Active" | "Inactive" | "Draft";

export type Property = {
  id: string;
  name: string;
  address: string;
  type: PropertyType;
  totalRooms: number;
  status: PropertyStatus;
  /** UI placeholder until bookings API exists */
  bookingsSummary: string;
  electricityPrice?: string;
  waterPrice?: string;
};

export type TaskStatus = "Todo" | "InProgress" | "Done" | "Cancelled";
export type TaskPriority = "Low" | "Normal" | "High";

export type OperationalTask = {
  id: string;
  title: string;
  property: string;
  room?: string;
  assignee?: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
};

export type BookingStatus = "Pending" | "Confirmed" | "CheckedIn" | "CheckedOut" | "Cancelled";

export type Booking = {
  id: string;
  guest: string;
  room: string;
  property: string;
  checkIn: string;
  checkOut: string;
  status: BookingStatus;
  amount: string;
};

export type UserRole = "Admin" | "Staff" | "PropertyOwner" | "Guest" | "Accountant";
export type UserStatus = "Active" | "Inactive";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
};

export type ContractStatus = "Draft" | "Active" | "Expired" | "Terminated";

export type Contract = {
  id: string;
  tenantId: string;
  tenantName: string;
  roomId: string;
  roomNumber: string;
  propertyId: string;
  propertyName: string;
  startDate: string;
  endDate: string;
  monthlyRate: string;
  depositAmount: string;
  status: ContractStatus;
  signedDate?: string;
  notes?: string;
};

export type ServiceType = "WiFi" | "Cleaning" | "Laundry" | "Parking" | "Security" | "Utilities" | "Other";

export type Service = {
  id: string;
  name: string;
  type: ServiceType;
  description?: string;
  price: string;
  isActive: boolean;
  propertyId: string;
};

export type PaymentStatus = "Pending" | "Processing" | "Completed" | "Failed" | "Refunded";

export type Payment = {
  id: string;
  invoiceId: string;
  amount: string;
  paymentMethod: "Cash" | "Bank Transfer" | "Credit Card" | "E-wallet";
  status: PaymentStatus;
  paidDate?: string;
  transactionId?: string;
};

export type ReportType = "Revenue" | "Occupancy" | "Tenant" | "Maintenance";

export type ActivityItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "Info" | "Alert" | "Success";
};

export type DashboardStats = {
  revenue: {
    total: number;
    trend: number;
  };
  rooms: {
    total: number;
    occupied: number;
    available: number;
    maintenance: number;
  };
  tenants: {
    active: number;
    newThisMonth: number;
  };
  tasks: {
    pending: number;
    completed: number;
  };
  recentActivity: ActivityItem[];
};
