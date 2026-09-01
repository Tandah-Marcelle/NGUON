import { api } from './api';

interface LoginResponse {
  token: string;
  username: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    this.setToken(response.token);
    this.setUsername(response.username);
    return response;
  },

  setToken(token: string) {
    localStorage.setItem('token', token);
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  setUsername(username: string) {
    localStorage.setItem('username', username);
  },

  getUsername(): string | null {
    return localStorage.getItem('username');
  },

  logout() {
    localStorage.clear();
  },

  // Reads the token's own `exp` claim — no server round-trip needed, so this
  // works even on an admin page that never happens to call the API.
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload.exp) return false;
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  },
};
