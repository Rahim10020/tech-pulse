// components/forms/ProfileForm.js - Formulaire d'édition de profil
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
    
    // Clear error when user starts typing
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
        <h2 className="text-xl font-poppins font-semibold text-gray-900 mb-4">
          Informations personnelles
        </h2>
        
        <div className="grid gap-4">
          {/* Nom */}
          <div>
            <label htmlFor="name" className="block font-poppins text-sm font-medium text-gray-700 mb-1">
              Nom complet
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full font-poppins px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Votre nom complet"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block font-poppins text-sm font-medium text-gray-700 mb-1">
              Biographie
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full font-poppins px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="Parlez-nous de vous..."
            />
          </div>

          {/* Localisation */}
          <div>
            <label htmlFor="location" className="block font-poppins text-sm font-medium text-gray-700 mb-1">
              Localisation
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full font-poppins px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="Ville, Pays"
            />
          </div>
        </div>
      </div>

      {/* Liens et réseaux sociaux */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-poppins font-semibold text-gray-900 mb-4">
          Liens et réseaux sociaux
        </h2>
        
        <div className="grid gap-4">
          {/* Site web */}
          <div>
            <label htmlFor="website" className="block font-poppins text-sm font-medium text-gray-700 mb-1">
              Site web
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 ${
                errors.website ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="https://votresite.com"
            />
            {errors.website && (
              <p className="mt-1 text-sm text-red-600">{errors.website}</p>
            )}
          </div>

          {/* Twitter */}
          <div>
            <label htmlFor="twitter" className="block font-poppins text-sm font-medium text-gray-700 mb-1">
              Twitter
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                @
              </span>
              <input
                type="text"
                id="twitter"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                placeholder="votre_pseudo"
              />
            </div>
          </div>

          {/* LinkedIn */}
          <div>
            <label htmlFor="linkedin" className="block font-poppins text-sm font-medium text-gray-700 mb-1">
              LinkedIn
            </label>
            <div className="flex">
              <span className="inline-flex font-poppins items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                linkedin.com/in/
              </span>
              <input
                type="text"
                id="linkedin"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                placeholder="votre-profil"
              />
            </div>
          </div>

          {/* GitHub */}
          <div>
            <label htmlFor="github" className="block font-poppins text-sm font-medium text-gray-700 mb-1">
              GitHub
            </label>
            <div className="flex">
              <span className="inline-flex font-poppins items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                github.com/
              </span>
              <input
                type="text"
                id="github"
                name="github"
                value={formData.github}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
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
          className="px-4 py-2 font-poppins text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          disabled={isLoading}
        >
          Annuler
        </button>
        
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-teal-600 font-poppins text-white rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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