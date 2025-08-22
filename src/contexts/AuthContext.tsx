import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'admin' | 'user' | 'store-owner';

export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: UserRole;
  storeId?: string; // For store owners
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Omit<User, 'id' | 'role'> & { password: string }) => Promise<void>;
  logout: () => void;
  updatePassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    name: 'System Administrator Account',
    email: 'admin@ratingvoyage.com',
    address: '123 Admin Street, Tech City, TC 12345',
    role: 'admin',
    password: 'Admin123!'
  },
  {
    id: '2',
    name: 'Demo Store Owner Account',
    email: 'owner@techstore.com',
    address: '456 Commerce Ave, Business District, BD 67890',
    role: 'store-owner',
    storeId: '1',
    password: 'Owner123!'
  },
  {
    id: '3',
    name: 'John Customer Smith',
    email: 'user@example.com',
    address: '789 Customer Lane, Residential Area, RA 13579',
    role: 'user',
    password: 'User123!'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Mock authentication
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const signup = async (userData: Omit<User, 'id' | 'role'> & { password: string }) => {
    // Mock signup - in real app this would call the backend
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      role: 'user'
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updatePassword = async (newPassword: string) => {
    // Mock password update
    console.log('Password updated for user:', user?.email);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}