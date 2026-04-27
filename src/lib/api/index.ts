import { billingApi } from "./billing";
import { bookingsApi } from "./bookings";
import { propertiesApi } from "./properties";
import { roomsApi } from "./rooms";
import { tasksApi } from "./tasks";
import { tenantsApi } from "./tenants";
import { usersApi } from "./users";
import { contractsApi } from "./contracts";
import { servicesApi } from "./services";
import { paymentsApi } from "./payments";
import { authApi } from "./auth";
import { analyticsApi } from "./analytics";

export * from "./types";
export {
  billingApi,
  bookingsApi,
  propertiesApi,
  roomsApi,
  tasksApi,
  tenantsApi,
  usersApi,
  contractsApi,
  servicesApi,
  paymentsApi,
  authApi,
  analyticsApi,
};

export const api = {
  ...roomsApi,
  ...tenantsApi,
  ...billingApi,
  ...propertiesApi,
  ...tasksApi,
  ...bookingsApi,
  ...usersApi,
  ...contractsApi,
  ...servicesApi,
  ...paymentsApi,
  ...authApi,
  ...analyticsApi,
};
