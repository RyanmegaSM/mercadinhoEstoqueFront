import { TOKEN_EXP, TOKEN_KEY } from "@/constants/storage-keys";
import { fetchWithAuth } from "./auth/auth-service";

const baseUrl = import.meta.env.VITE_API_URL || "";

export interface ApiOptions extends RequestInit {
  headers?: Record<string, string>;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: BodyInit | null;
}

const api = async <T>(url: string, options: ApiOptions = {}): Promise<T> => {
  const response = await fetchWithAuth(`${baseUrl}/${url}`, { ...options });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem(TOKEN_EXP);
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = "/login";
    }

    const errorBody = await response.json();
    const errorMessage = errorBody?.message || response.statusText;
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return {} as T;
  }

  const text = await response.text();

  return JSON.parse(text);
};

export default api;
