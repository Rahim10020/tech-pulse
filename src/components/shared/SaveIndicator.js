// components/shared/SaveIndicator.js - Indicateur de statut de sauvegarde
'use client';

import { useState, useEffect } from 'react';
import { Cloud, CloudOff, Loader2, Check } from 'lucide-react';

export default function SaveIndicator({ 
  isSaving = false, 
  lastSaved = null, 
  hasUnsavedChanges = false,
  className = '' 
}) {
  const [timeAgo, setTimeAgo] = useState('');

  // Mettre à jour l'affichage du temps écoulé
  useEffect(() => {
    if (!lastSaved) return;

    const updateTimeAgo = () => {
      const now = new Date();
      const diff = Math.floor((now - lastSaved) / 1000); // en secondes

      if (diff < 60) {
        setTimeAgo('à l\'instant');
      } else if (diff < 3600) {
        const minutes = Math.floor(diff / 60);
        setTimeAgo(`il y a ${minutes} min`);
      } else {
        const hours = Math.floor(diff / 3600);
        setTimeAgo(`il y a ${hours}h`);
      }
    };

    // Mettre à jour immédiatement
    updateTimeAgo();

    // Puis toutes les 30 secondes
    const interval = setInterval(updateTimeAgo, 30000);

    return () => clearInterval(interval);
  }, [lastSaved]);

  // Déterminer l'état d'affichage
  const getDisplayState = () => {
    if (isSaving) {
      return {
        icon: <Loader2 className="w-4 h-4 animate-spin" />,
        text: 'Sauvegarde...',
        textColor: 'text-blue-600',
        iconColor: 'text-blue-600'
      };
    }

    if (hasUnsavedChanges) {
      return {
        icon: <CloudOff className="w-4 h-4" />,
        text: 'Modifications non sauvegardées',
        textColor: 'text-orange-600',
        iconColor: 'text-orange-600'
      };
    }

    if (lastSaved) {
      return {
        icon: <Check className="w-4 h-4" />,
        text: `Sauvegardé ${timeAgo}`,
        textColor: 'text-green-600',
        iconColor: 'text-green-600'
      };
    }

    return {
      icon: <Cloud className="w-4 h-4" />,
      text: 'Pas encore sauvegardé',
      textColor: 'text-gray-500',
      iconColor: 'text-gray-500'
    };
  };

  const state = getDisplayState();

  return (
    <div className={`flex items-center space-x-2 text-sm ${className}`}>
      <span className={state.iconColor}>
        {state.icon}
      </span>
      <span className={`${state.textColor} font-medium`}>
        {state.text}
      </span>
    </div>
  );
}