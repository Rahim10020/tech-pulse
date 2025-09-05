'use client';

import { useState } from 'react';

export default function ProfileForm({ initialData, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    bio: initialData?.bio || '',
    location: initialData?.location || '',
    website: initialData?.website || '',
    twitter: initialData?.twitter || '',
    linkedin: initialData?.linkedin || '',
    github: initialData?.github || '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (formData.website && !formData.website.startsWith('http')) {
      newErrors.website = 'L\'URL doit commencer par http:// ou https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations de base */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="h3-title text-gray-900 mb-6">
          Informations personnelles
        </h2>

        <div className="grid gap-4">
          {/* Nom */}
          <div>
            <label htmlFor="name" className="h5-title text-gray-700 mb-4">
              Nom complet
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input-field ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Votre nom complet"
            />
            {errors.name && (
              <p className="small-text text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="h5-title text-gray-700 mb-4">
              Biographie
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="input-field"
              placeholder="Parlez-nous de vous..."
            />
          </div>

          {/* Localisation */}
          <div>
            <label htmlFor="location" className="h5-title text-gray-700 mb-4">
              Localisation
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="input-field"
              placeholder="Ville, Pays"
            />
          </div>
        </div>
      </div>

      {/* Liens et réseaux sociaux */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="h3-title text-gray-900 mb-4">
          Liens et réseaux sociaux
        </h2>

        <div className="grid gap-4">
          {/* Site web */}
          <div>
            <label htmlFor="website" className="h5-title text-gray-700 mb-1">
              Site web
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className={`input-field ${errors.website ? 'border-red-500' : ''}`}
              placeholder="https://votresite.com"
            />
            {errors.website && (
              <p className="small-text text-red-600 mt-1">{errors.website}</p>
            )}
          </div>

          {/* Twitter */}
          <div>
            <label htmlFor="twitter" className="h5-title text-gray-700 mb-1">
              Twitter
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 small-text text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                @
              </span>
              <input
                type="text"
                id="twitter"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                className="flex-1 input-field rounded-l-none"
                placeholder="votre_pseudo"
              />
            </div>
          </div>

          {/* LinkedIn */}
          <div>
            <label htmlFor="linkedin" className="h5-title text-gray-700 mb-1">
              LinkedIn
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 small-text text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                linkedin.com/in/
              </span>
              <input
                type="text"
                id="linkedin"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className="flex-1 input-field rounded-l-none"
                placeholder="votre-profil"
              />
            </div>
          </div>

          {/* GitHub */}
          <div>
            <label htmlFor="github" className="h5-title text-gray-700 mb-1">
              GitHub
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 small-text text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                github.com/
              </span>
              <input
                type="text"
                id="github"
                name="github"
                value={formData.github}
                onChange={handleChange}
                className="flex-1 input-field rounded-l-none"
                placeholder="votre-username"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-between items-center bg-white rounded-lg shadow-sm border p-6">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="btn-secondary"
          disabled={isLoading}
        >
          Annuler
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Mise à jour...</span>
            </div>
          ) : (
            'Sauvegarder'
          )}
        </button>
      </div>
    </form>
  );
}