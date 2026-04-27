import { users } from "./mock-data";
import { delay, fetchJson, getEndpointPath, hasBackendConfig } from "./shared";
import type { User } from "./types";

export const usersApi = {
  getUsers: async (): Promise<{ data: User[]; total: number }> => {
    if (hasBackendConfig) {
      const path = getEndpointPath("NEXT_PUBLIC_API_USERS_PATH", "/users");
      return fetchJson<{ data: User[]; total: number }>(path);
    }

    await delay(250);
    return { data: users, total: users.length };
  },
};
