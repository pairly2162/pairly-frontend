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

      // For now, if we have a token, assume it's valid
      // In production, you might want to validate it with the backend
      setIsAuthenticated(true);
      setAdmin({
        id: 'admin',
        name: 'Admin User',
        email: 'admin@pairly.com',
        profilePhotoUrl: null,
        isOnline: true,
        isDeleted: false,
        isSuperAdmin: true,
        isMockData: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
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
