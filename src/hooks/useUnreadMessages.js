// src/hooks/useUnreadMessages.js - Hook pour gérer les messages non lus
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { isAdmin } from '@/lib/auth-roles';

export function useUnreadMessages() {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fonction pour récupérer le nombre de messages non lus
  const fetchUnreadCount = useCallback(async () => {
    // Seulement pour les admins
    if (!user || !isAdmin(user)) {
      setUnreadCount(0);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/contact?unread=true&limit=1', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unreadCount || 0);
      } else {
        throw new Error('Failed to fetch unread count');
      }
    } catch (err) {
      console.error('Error fetching unread messages count:', err);
      setError(err.message);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Charger les données au montage et quand l'utilisateur change
  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  // Polling automatique toutes les 30 secondes pour les admins
  useEffect(() => {
    if (!user || !isAdmin(user)) return;

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000); // 30 secondes

    return () => clearInterval(interval);
  }, [user, fetchUnreadCount]);

  // Fonction pour marquer des messages comme lus (diminuer le compteur)
  const markAsRead = useCallback((count = 1) => {
    setUnreadCount(prev => Math.max(0, prev - count));
  }, []);

  // Fonction pour ajouter de nouveaux messages non lus (augmenter le compteur)
  const addUnread = useCallback((count = 1) => {
    setUnreadCount(prev => prev + count);
  }, []);

  // Fonction pour rafraîchir manuellement
  const refresh = useCallback(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  return {
    unreadCount,
    loading,
    error,
    markAsRead,
    addUnread,
    refresh,
    isAdmin: user && isAdmin(user)
  };
}