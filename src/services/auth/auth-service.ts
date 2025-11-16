import type { SignInResponse } from "@/interfaces/sign-in";
import { TOKEN_EXP, TOKEN_KEY } from "../../constants/storage-keys";

const baseUrl = import.meta.env.VITE_API_URL || "";

if (!baseUrl) {
  throw new Error("API_URL não está definida nas variáveis de ambiente.");
}

export async function signIn(
  email: string,
  password: string
): Promise<SignInResponse> {
  const response = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const jsonResponse = await response.json();

    throw new Error(jsonResponse.message || "Erro ao fazer login.");
  }

  const data = await response.json();
  if (!data.token) {
    throw new Error("Token de autenticação não encontrado na resposta.");
  }
  localStorage.setItem(TOKEN_KEY, data.token);
  return data;
}

export function signOut() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXP);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(init?.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return fetch(input, {
    ...init,
    headers,
  });
}
