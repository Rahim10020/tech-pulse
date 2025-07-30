// src/context/AuthProvider.js - Système d'auth avec PostgreSQL
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
      setLoading(true);
      
      // Appeler l'API /me pour vérifier le token dans les cookies
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include' // Important pour inclure les cookies
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
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
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important pour les cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Erreur de connexion au serveur' };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, username, email, password) => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important pour les cookies
        body: JSON.stringify({ name, username, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Erreur lors de la création du compte' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // Appeler l'API de déconnexion
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include' // Important pour les cookies
      });

      setUser(null);
      
      // Optionnel : rediriger vers la page d'accueil
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Même en cas d'erreur, déconnecter localement
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        return { success: true, message: 'Profil mis à jour avec succès' };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Erreur lors de la mise à jour du profil' };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (data.success) {
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Password change error:', error);
      return { success: false, error: 'Erreur lors du changement de mot de passe' };
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour vérifier la disponibilité d'un email
  const checkEmailAvailability = async (email) => {
    try {
      const response = await fetch(`/api/auth/check-availability?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      return data.available;
    } catch (error) {
      console.error('Error checking email availability:', error);
      return false;
    }
  };

  // Fonction pour vérifier la disponibilité d'un username
  const checkUsernameAvailability = async (username) => {
    try {
      const response = await fetch(`/api/auth/check-availability?username=${encodeURIComponent(username)}`);
      const data = await response.json();
      return data.available;
    } catch (error) {
      console.error('Error checking username availability:', error);
      return false;
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    changePassword,
    checkAuth,
    checkEmailAvailability,
    checkUsernameAvailability
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