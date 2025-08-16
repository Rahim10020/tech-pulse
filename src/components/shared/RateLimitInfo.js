"use client";

import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, Shield } from 'lucide-react';

export default function RateLimitInfo({ lastResponse }) {
  const [retryAfter, setRetryAfter] = useState(0);

  useEffect(() => {
    if (lastResponse?.retryAfter) {
      setRetryAfter(lastResponse.retryAfter);
      
      const interval = setInterval(() => {
        setRetryAfter(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [lastResponse]);

  if (!lastResponse || lastResponse.code !== 'RATE_LIMIT_EXCEEDED') {
    return null;
  }

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="h5-title text-orange-800 mb-1">
            Limite de requêtes atteinte
          </h3>
          <p className="small-text text-orange-700 mb-3">
            {lastResponse.error}
          </p>
          
          {retryAfter > 0 && (
            <div className="flex items-center space-x-2 small-text text-orange-600">
              <Clock className="w-4 h-4" />
              <span>Réessayez dans {formatTime(retryAfter)}</span>
            </div>
          )}
          
          <div className="mt-3 text-xs text-orange-600 flex items-center space-x-1">
            <Shield className="w-3 h-3" />
            <span>Cette protection évite les abus et maintient la qualité du service</span>
          </div>
        </div>
      </div>
    </div>
  );
}