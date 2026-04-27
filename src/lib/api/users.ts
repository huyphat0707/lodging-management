import { users } from "./mock-data";
import { delay, fetchJson, getEndpointPath, hasBackendConfig } from "./shared";
import type { User } from "./types";

export const usersApi = {
  getUsers: async (): Promise<User[]> => {
    if (hasBackendConfig) {
      const path = getEndpointPath("NEXT_PUBLIC_API_USERS_PATH", "/users");
      return fetchJson<User[]>(path);
    }

    await delay(250);
    return users;
  },
};
