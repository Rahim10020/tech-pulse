// src/components/shared/UnreadBadge.js - Composant badge pour messages non lus
"use client";

import { useAuth } from "@/context/AuthProvider";
import { isAdmin } from "@/lib/auth-roles";

export default function UnreadBadge({
  className = "",
  size = "sm", // "xs", "sm", "md", "lg"
  position = "top-right", // "top-right", "top-left", "bottom-right", "bottom-left", "inline"
  maxCount = 99,
  showZero = false,
}) {
  const { user, unreadCount } = useAuth();
  const isAdminUser = user && isAdmin(user);

  // Ne pas afficher si pas admin ou si count = 0 et showZero = false
  if (!isAdminUser || (!showZero && unreadCount === 0)) {
    return null;
  }

  // Classes pour les différentes tailles
  const sizeClasses = {
    xs: "w-3 h-3 text-xs",
    sm: "w-4 h-4 text-xs",
    md: "w-5 h-5 text-xs",
    lg: "w-6 h-6 text-sm",
  };

  // Classes pour les différentes positions
  const positionClasses = {
    "top-right": "absolute -top-1 -right-1",
    "top-left": "absolute -top-1 -left-1",
    "bottom-right": "absolute -bottom-1 -right-1",
    "bottom-left": "absolute -bottom-1 -left-1",
    inline: "relative inline-flex",
  };

  const displayCount = unreadCount > maxCount ? `${maxCount}+` : unreadCount;

  return (
    <span
      className={`
        bg-red-500 text-white font-bold rounded-full 
        flex items-center justify-center
        ${sizeClasses[size]} 
        ${positionClasses[position]}
        ${className}
      `}
      title={`${unreadCount} message${unreadCount > 1 ? "s" : ""} non lu${unreadCount > 1 ? "s" : ""
        }`}
    >
      {displayCount}
    </span>
  );
}

// Composant pour utilisation avec icônes
export function IconWithBadge({
  icon: Icon,
  iconClassName = "w-5 h-5",
  badgeProps = {},
  onClick,
  className = "",
}) {
  return (
    <div className={`relative cursor-pointer ${className}`} onClick={onClick}>
      <Icon className={iconClassName} />
      <UnreadBadge {...badgeProps} />
    </div>
  );
}

// Hook simplifié pour juste obtenir le count
export function useUnreadCount() {
  const { user, unreadCount } = useAuth();
  const isAdminUser = user && isAdmin(user);
  return isAdminUser ? unreadCount : 0;
}
