import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, AdminLoginRequest, AdminUser } from '../services/auth.service';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  admin: AdminUser | null;
  login: (credentials: AdminLoginRequest) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      
      // First check if we have a token
      const token = authService.getToken();
      
      if (!token) {
        setIsAuthenticated(false);
        setAdmin(null);
        return;
      }

      // Get current admin data from the API
      const response = await authService.getCurrentAdmin();
      if (response.success) {
        setIsAuthenticated(true);
        setAdmin({
          id: response.admin.id,
          name: response.admin.name,
          email: response.admin.email,
          gender: null,
          profilePhotoUrl: null,
          formattedAddress: null,
          isOnline: true,
          isDeleted: false,
          isSuperAdmin: response.admin.isSuperAdmin,
          isMockData: response.admin.isMockData,
          createdAt: response.admin.createdAt,
          updatedAt: response.admin.updatedAt,
        });
      } else {
        setIsAuthenticated(false);
        setAdmin(null);
      }
    } catch (error) {
      console.warn('Auth check failed:', error);
      setIsAuthenticated(false);
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: AdminLoginRequest) => {
    const response = await authService.login(credentials);
    if (response.success) {
      setIsAuthenticated(true);
      setAdmin(response.admin as any);
    } else {
      throw new Error(response.message);
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setAdmin(null);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    admin,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
