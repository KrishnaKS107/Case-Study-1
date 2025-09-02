export type Role = 'ADMIN' | 'USER' | 'OWNER';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const apiFetch = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const token = localStorage.getItem('accessToken');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
};
