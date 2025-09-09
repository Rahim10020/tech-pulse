// src/hooks/useUnreadMessages.js - Hook pour gérer les messages non lus (maintenant basé sur le contexte)
import { useAuth } from '@/context/AuthProvider';
import { isAdmin } from '@/lib/auth-roles';

export function useUnreadMessages() {
  const {
    user,
    unreadCount,
    messagesLoading,
    markMessagesAsRead,
    refreshUnreadCount
  } = useAuth();

  // Fonction pour marquer des messages comme lus (diminuer le compteur)
  const markAsRead = (count = 1) => {
    markMessagesAsRead(count);
  };

  // Fonction pour ajouter de nouveaux messages non lus (augmenter le compteur)
  const addUnread = (count = 1) => {
    // Note: Cette fonction n'est plus nécessaire car le contexte gère automatiquement
    console.warn('addUnread is deprecated. Use refreshUnreadCount instead.');
  };

  // Fonction pour rafraîchir manuellement
  const refresh = () => {
    refreshUnreadCount();
  };

  return {
    unreadCount,
    loading: messagesLoading,
    error: null, // Le contexte ne gère pas les erreurs pour l'instant
    markAsRead,
    addUnread,
    refresh,
    isAdmin: user && isAdmin(user)
  };
}