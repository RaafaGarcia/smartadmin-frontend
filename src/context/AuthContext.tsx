import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApiService } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Verificar token al cargar la app
    const checkToken = () => {
      const token = localStorage.getItem('access_token');
      
      if (token && ApiService.isTokenValid()) {
        setIsAuthenticated(true);
        console.log('Token válido encontrado');
      } else {
        // Token inválido o expirado
        localStorage.removeItem('access_token');
        setIsAuthenticated(false);
        console.log('Token inválido o expirado');
      }
      
      setIsLoading(false);
    };

    checkToken();

    // Verificar token cada 5 minutos
    const interval = setInterval(checkToken, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Intentando login para:', email);
      
      const result = await ApiService.login(email, password);
      
      if (result.access_token) {
        setIsAuthenticated(true);
        console.log('Login exitoso');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    ApiService.logout();
    setIsAuthenticated(false);
    console.log('Logout exitoso');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};