import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  accessToken: string;
  admin: {
    id: string;
    email: string;
    name: string;
  };
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  profilePhotoUrl: string | null;
  isOnline: boolean;
  isDeleted: boolean;
  isSuperAdmin: boolean;
  isMockData: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserListResponse {
  success: boolean;
  message: string;
  data: {
    data: AdminUser[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface UserPaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  roleId?: string;
  isActive?: boolean;
  isOnline?: boolean;
  isMockData?: boolean;
}

class AuthService {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('admin_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('admin_token', token);
  }

  getToken(): string | null {
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('admin_token');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  async login(credentials: AdminLoginRequest): Promise<AdminLoginResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/login`, credentials);
      const data = response.data;
      
      if (data.success && data.accessToken) {
        this.setToken(data.accessToken);
      }
      
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async validateToken(): Promise<boolean> {
    if (!this.token) {
      return false;
    }
    
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/validate-token`, {
        token: this.token
      });
      return response.data.success && response.data.valid;
    } catch {
      this.clearToken();
      return false;
    }
  }

  async getUsers(params: UserPaginationParams = {}): Promise<AdminUserListResponse> {
    if (!this.token) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        params
      });
      return response.data;
    } catch (err: any) {
      if (err.response?.status === 401) {
        this.clearToken();
        throw new Error('Session expired. Please login again.');
      }
      throw new Error(err.response?.data?.message || 'Failed to fetch users');
    }
  }

  async getUserStats() {
    if (!this.token) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/admin/users/stats`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      });
      return response.data;
    } catch (err: any) {
      if (err.response?.status === 401) {
        this.clearToken();
        throw new Error('Session expired. Please login again.');
      }
      throw new Error(err.response?.data?.message || 'Failed to fetch user stats');
    }
  }

  logout() {
    this.clearToken();
  }
}

export const authService = new AuthService();
