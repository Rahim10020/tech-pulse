// src/hooks/useSettings.js - Hook pour les paramètres du site
import { useState, useEffect } from 'react';

export function useSettings() {
  const [settings, setSettings] = useState({
    siteName: 'pixelpulse',
    siteDescription: 'Blog technologique moderne',
    siteUrl: '',
    contactEmail: '',
    contactPhone: '',
    contactAddress: '',
    socialTwitter: '',
    socialLinkedin: '',
    socialGithub: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    maintenanceMode: false,
    allowComments: true,
    allowRegistration: true
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/settings');

      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      } else {
        setError('Erreur lors du chargement des paramètres');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setError('Erreur lors du chargement des paramètres');
    } finally {
      setLoading(false);
    }
  };

  return { settings, loading, error, refetch: fetchSettings };
} 