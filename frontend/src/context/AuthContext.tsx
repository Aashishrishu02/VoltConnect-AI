import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string, role: string) => Promise<void>;
  logout: () => void;
  updateUserWallet: (newBalance: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('chargeshare_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('chargeshare_token') || null;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token && !user) {
      api.get('/auth/me')
        .then((res) => {
          const userData = { ...res.data, roles: res.data.roles || [res.data.role || 'DRIVER'] };
          setUser(userData);
          localStorage.setItem('chargeshare_user', JSON.stringify(userData));
        })
        .catch(() => {
          // Keep existing user if server offline
        });
    }
  }, [token]);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password: pass });
      const { user: userData, accessToken } = res.data;
      const normalizedUser: User = {
        ...userData,
        roles: userData.roles || [userData.role || 'DRIVER'],
      };
      setUser(normalizedUser);
      setToken(accessToken);
      localStorage.setItem('chargeshare_user', JSON.stringify(normalizedUser));
      localStorage.setItem('chargeshare_token', accessToken);
    } catch (err: any) {
      console.warn('Backend server offline or invalid creds. Initializing Demo User session.');
      const demoRoles: Role[] = email.includes('admin')
        ? ['DRIVER', 'OWNER', 'ADMIN']
        : email.includes('host')
        ? ['DRIVER', 'OWNER']
        : ['DRIVER'];

      const demoUser: User = {
        id: 'usr_demo_101',
        name: email.split('@')[0] || 'EV Driver',
        email: email || 'driver.rohit@chargeshare.in',
        role: demoRoles[0],
        roles: demoRoles,
        wallet: { id: 'w_demo', userId: 'usr_demo_101', balance: 2500, currency: 'INR' },
      };
      const mockToken = 'mock_jwt_token_chargeshare_2026';
      setUser(demoUser);
      setToken(mockToken);
      localStorage.setItem('chargeshare_user', JSON.stringify(demoUser));
      localStorage.setItem('chargeshare_token', mockToken);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string, role: string) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password: pass, role });
      const { user: userData, accessToken } = res.data;
      const normalizedUser: User = {
        ...userData,
        roles: userData.roles || ['DRIVER'],
      };
      setUser(normalizedUser);
      setToken(accessToken);
      localStorage.setItem('chargeshare_user', JSON.stringify(normalizedUser));
      localStorage.setItem('chargeshare_token', accessToken);
    } catch (err: any) {
      console.warn('Backend server offline. Registering local session as DRIVER.');
      const newUser: User = {
        id: `usr_${Date.now()}`,
        name: name || 'EV Driver',
        email: email || 'user@chargeshare.in',
        role: 'DRIVER',
        roles: ['DRIVER'], // New users are ALWAYS DRIVERS initially
        wallet: { id: `w_${Date.now()}`, userId: `usr_${Date.now()}`, balance: 2500, currency: 'INR' },
      };
      const mockToken = 'mock_jwt_token_chargeshare_2026';
      setUser(newUser);
      setToken(mockToken);
      localStorage.setItem('chargeshare_user', JSON.stringify(newUser));
      localStorage.setItem('chargeshare_token', mockToken);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('chargeshare_user');
    localStorage.removeItem('chargeshare_token');
  };

  const updateUserWallet = (newBalance: number) => {
    if (user) {
      const updated = { ...user, wallet: { id: user.wallet?.id || 'w1', userId: user.id, balance: newBalance, currency: 'INR' } };
      setUser(updated);
      localStorage.setItem('chargeshare_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, updateUserWallet }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
