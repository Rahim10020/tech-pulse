/**
 * UnreadBadge component displays a badge with unread message count for admin users.
 *
 * @param {Object} props - The component props
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {'xs'|'sm'|'md'|'lg'} [props.size='sm'] - Size of the badge
 * @param {'top-right'|'top-left'|'bottom-right'|'bottom-left'|'inline'} [props.position='top-right'] - Position of the badge
 * @param {number} [props.maxCount=99] - Maximum count to display before showing "99+"
 * @param {boolean} [props.showZero=false] - Whether to show the badge when count is 0
 * @returns {JSX.Element|null} The badge element or null if not visible
 */
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
