// src/components/forms/SignupForm.js - Avec composant Input
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';

export default function SignupForm({ onSubmit, isLoading = false }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Le nom d\'utilisateur est requis';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Username Field */}
      <Input
        label="Nom d'utilisateur"
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        error={errors.username}
        placeholder="Votre nom d'utilisateur"
        disabled={isLoading}
        autoComplete="username"
      />

      {/* Email Field */}
      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        placeholder="votre@email.com"
        disabled={isLoading}
        autoComplete="email"
      />

      {/* Password Field */}
      <Input
        label="Mot de passe"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        placeholder="Mot de passe sécurisé"
        disabled={isLoading}
        autoComplete="new-password"
      />

      {/* Confirm Password Field */}
      <Input
        label="Confirmer le mot de passe"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        placeholder="Confirmez votre mot de passe"
        disabled={isLoading}
        autoComplete="new-password"
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-poppins disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Création en cours...
          </>
        ) : (
          'Créer mon compte'
        )}
      </button>
    </form>
  );
}