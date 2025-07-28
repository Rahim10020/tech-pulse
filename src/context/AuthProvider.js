// src/context/AuthProvider.js - Provider d'authentification
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulation de vérification d'auth
  useEffect(() => {
    // Simuler une vérification d'authentification
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const login = async (email, password) => {
    try {
      // Simulation de login
      if (email === 'test@test.com' && password === '123456') {
        const mockUser = {
          id: 1,
          name: 'Test User',
          email: 'test@test.com',
          username: 'testuser'
        };
        setUser(mockUser);
        return { success: true };
      } else {
        return { success: false, error: 'Identifiants invalides' };
      }
    } catch (error) {
      return { success: false, error: 'Erreur de connexion' };
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
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