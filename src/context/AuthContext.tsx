import React, { createContext, useContext } from 'react';
import { useCurrentUser, useSignOut } from '@/services/hooks/useAuth';
import TokenService from '../utils/token';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  refetchUser: () => void;
  hasToken: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const hasToken = TokenService.hasToken();
  const { data: user, isLoading, refetch } = useCurrentUser(hasToken);
  const { mutate: signOut } = useSignOut();

  const logout = () => {
    signOut();
  };

  const refetchUser = () => {
    if (hasToken) {
      refetch();
    }
  };

  const value: AuthContextType = {
    user: user || null,
    isAuthenticated: !!user,
    isLoading: isLoading && hasToken,
    logout,
    refetchUser,
    hasToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
