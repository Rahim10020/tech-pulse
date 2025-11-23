/** @description Page de réinitialisation du mot de passe avec code de vérification */
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/Input';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        code: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Validation des mots de passe
        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères');
            setIsLoading(false);
            return;
        }

        // Validation du code (6 chiffres)
        if (!/^\d{6}$/.test(formData.code)) {
            setError('Le code doit contenir exactement 6 chiffres');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    code: formData.code,
                    password: formData.password
                }),
            });

            if (response.ok) {
                setIsSuccess(true);
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Une erreur est survenue');
            }
        } catch (error) {
            setError('Erreur réseau. Veuillez réessayer.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/">
                        <Image src="/logo.png"
                            alt="Logo PixelPulse"
                            width={40}
                            height={40}
                            className="h-10" />
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-md mx-auto pt-24 px-6">
                {!isSuccess ? (
                    <>
                        <div className="text-center mb-12">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Nouveau mot de passe</h1>
                            <p className="text-gray-600">Entrez votre email, le code reçu et votre nouveau mot de passe.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <p className="text-red-600 text-sm">{error}</p>
                                </div>
                            )}

                            <Input
                                label="Adresse email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="votre@email.com"
                                required
                            />

                            <Input
                                label="Code de réinitialisation (6 chiffres)"
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleInputChange}
                                placeholder="123456"
                                maxLength="6"
                                required
                            />

                            <Input
                                label="Nouveau mot de passe"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Entrez votre nouveau mot de passe"
                                showPasswordToggle={true}
                                required
                            />

                            <Input
                                label="Confirmer le mot de passe"
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="Confirmez votre nouveau mot de passe"
                                showPasswordToggle={true}
                                required
                            />

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-gray-600">
                                Vous n&apos;avez pas reçu le code ?{' '}
                                <Link href="/forgot-password" className="text-black font-medium hover:underline">
                                    Renvoyer un code
                                </Link>
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Mot de passe mis à jour !</h1>
                        <p className="text-gray-600 mb-8">
                            Votre mot de passe a été mis à jour avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
                        </p>
                        <Link
                            href="/login"
                            className="inline-block bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                        >
                            Se connecter
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}