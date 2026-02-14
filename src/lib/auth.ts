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

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
