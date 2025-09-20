import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.pairly.fun';

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
  gender: string | null;
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

export interface DashboardStats {
  totalUsers: number;
  onlineUsers: number;
  offlineUsers: number;
}

export interface DashboardStatsResponse {
  success: boolean;
  message: string;
  data: DashboardStats;
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

  async getDashboardStats(): Promise<DashboardStatsResponse> {
    if (!this.token) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/admin/dashboard/stats`, {
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
      throw new Error(err.response?.data?.message || 'Failed to fetch dashboard stats');
    }
  }

  async updateProfile(adminId: string, profileData: { name: string }) {
    if (!this.token) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/admin/users/${adminId}/profile`, profileData, {
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
      throw new Error(err.response?.data?.message || 'Failed to update profile');
    }
  }

  async changePassword(adminId: string, passwordData: { currentPassword: string; newPassword: string; confirmPassword: string }) {
    if (!this.token) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/admin/users/${adminId}/password`, passwordData, {
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
      throw new Error(err.response?.data?.message || 'Failed to change password');
    }
  }

  async updateSettings(adminId: string, settingsData: { isMockDataEnabled: boolean }) {
    if (!this.token) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/admin/users/global-settings/mock-data`, {
        enabled: settingsData.isMockDataEnabled
      }, {
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
      throw new Error(err.response?.data?.message || 'Failed to update settings');
    }
  }

  async getCurrentAdmin() {
    if (!this.token) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/admin/me`, {
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
      throw new Error(err.response?.data?.message || 'Failed to get current admin');
    }
  }

  async getGlobalSettings() {
    if (!this.token) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/admin/users/global-settings/data`, {
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
      throw new Error(err.response?.data?.message || 'Failed to get global settings');
    }
  }


  logout() {
    this.clearToken();
  }
}

export const authService = new AuthService();
