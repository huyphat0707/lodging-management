import { toast } from "sonner";

export const LANGUAGE_STORAGE_KEY = "app_language";
export const AUTH_TOKEN_KEY = "auth_token";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://localhost:3000";
const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX?.trim() || "/api/v1";

export const hasBackendConfig = true; // Always true now as we are integrating

const normalizePath = (path: string) => (path.startsWith("/") ? path : `/${path}`);
const stripTrailingSlash = (value: string) => value.replace(/\/+$/, "");
const stripLeadingAndTrailingSlash = (value: string) => value.replace(/^\/+|\/+$/g, "");

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function getEndpointPath(envVar: string, defaultPath: string): string {
  if (typeof window !== "undefined") {
    return (process.env[envVar] as string) || defaultPath;
  }
  return defaultPath;
}

export interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data: T;
  total?: number;
}

// Helper to convert snake_case to camelCase
function snakeToCamel(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => snakeToCamel(v));
  } else if (obj !== null && obj !== undefined && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [key.replace(/(_\w)/g, m => m[1].toUpperCase())]: snakeToCamel(obj[key]),
      }),
      {}
    );
  }
  return obj;
}

export async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const language =
    typeof window !== "undefined" &&
      (localStorage.getItem(LANGUAGE_STORAGE_KEY) === "vi" || localStorage.getItem(LANGUAGE_STORAGE_KEY) === "en")
      ? (localStorage.getItem(LANGUAGE_STORAGE_KEY) as "en" | "vi")
      : "vi";

  const token = typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN_KEY) : null;

  const endpoint = normalizePath(path);
  const base = stripTrailingSlash(API_BASE_URL);
  const versionPrefix = stripLeadingAndTrailingSlash(API_PREFIX);
  const url = `${base}/${versionPrefix}${endpoint}`;

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  headers.set("Accept-Language", language);
  headers.set("X-Language", language);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (res.status === 204) {
    return null as any;
  }

  const result: ApiResponse<T> = await res.json();

  if (!res.ok) {
    const errorMessage = result.message || `Request failed (${res.status})`;
    if (typeof window !== "undefined") {
      toast.error(errorMessage);
    }
    throw new Error(errorMessage);
  }

  const camelData = snakeToCamel(result.data);
  const camelMeta = snakeToCamel((result as any).meta);

  if (camelMeta) {
    return { data: camelData, meta: camelMeta } as any;
  }

  return camelData;
}

export async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  return request<T>(path, options);
}

// Helper methods
export const api = {
  get: <T>(path: string, options?: RequestInit) => request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body: any, options?: RequestInit) =>
    request<T>(path, { ...options, method: "POST", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: any, options?: RequestInit) =>
    request<T>(path, { ...options, method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string, options?: RequestInit) => request<T>(path, { ...options, method: "DELETE" }),
};
