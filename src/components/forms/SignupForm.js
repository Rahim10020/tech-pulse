'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

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

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Le nom d\'utilisateur est requis';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

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
        className="h5-title"
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
        className="h5-title"
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
        className="h5-title"
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
        className="h5-title"
      />

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h5-title"
        isLoading={isLoading}
      >
        Créer mon compte
      </Button>

      <p className="small-text text-center text-gray-500 mt-4">
        Déjà un compte ?{' '}
        <a href="/login" className="text-teal-600 hover:text-teal-700 underline">
          Se connecter
        </a>
      </p>
    </form>
  );
}