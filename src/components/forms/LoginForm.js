"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="space-y-4">
      {/* Google Login Button */}
      <Button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full bg-gray-50 text-gray-700 border border-gray-300 hover:text-white flex items-center justify-center gap-2"
        disabled={isLoading}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continuer avec Google
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">Ou continuer avec</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Adresse e-mail"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder=""
          required
          className="h5-title"
        />

        <Input
          label="Mot de passe"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder=""
          required
          className="h5-title"
          showPasswordToggle={true}
        />

        <div className="text-right">
          <Link
            href="/forgot-password"
            className="small-text text-gray-500 hover:text-gray-700 underline"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h5-title"
          isLoading={isLoading}
        >
          {isLoading ? "Connexion..." : "Se connecter"}
        </Button>

        <p className="small-text text-center text-gray-500 mt-4">
          Vous n&apos;avez pas de compte ?{" "}
          <Link href="/signup" className="text-teal-600 hover:text-teal-700 underline">
            S&apos;inscrire
          </Link>
        </p>
      </form>
    </div>
  );
}