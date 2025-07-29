// src/context/AuthProvider.js - Système d'auth complet
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Vérifier s'il y a un token dans localStorage
      const token = localStorage.getItem('token');
      if (token) {
        // Vous pouvez vérifier le token avec votre API
        // Pour l'instant, on simule un utilisateur
        const mockUser = {
          id: 1,
          name: 'Test User',
          email: 'test@techpulse.com',
          username: 'testuser'
        };
        setUser(mockUser);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Simulation de connexion (remplacez par votre API)
      if (email === 'test@techpulse.com' && password === '123456') {
        const user = {
          id: 1,
          name: 'Test User',
          email: 'test@techpulse.com',
          username: 'testuser'
        };
        
        // Sauvegarder le token
        localStorage.setItem('token', 'fake-jwt-token');
        setUser(user);
        
        return { success: true };
      } else {
        return { success: false, error: 'Identifiants invalides' };
      }
    } catch (error) {
      return { success: false, error: 'Erreur de connexion' };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username, email, password) => {
    try {
      setLoading(true);
      
      // Simulation d'inscription (remplacez par votre API)
      const user = {
        id: Date.now(),
        name: username,
        email: email,
        username: username
      };
      
      localStorage.setItem('token', 'fake-jwt-token');
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erreur lors de la création du compte' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      // Simulation de mise à jour (remplacez par votre API)
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erreur lors de la mise à jour' };
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook useAuth dans le même fichier
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}