"use client";

import { useState } from "react";
import Link from "next/link";
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
        className="h5-title"
      />

      <Input
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        required
        className="h5-title"
      />

      <div className="text-right">
        <Link
          href="/forgot-password"
          className="small-text text-gray-500 hover:text-gray-700 underline"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h5-title"
        isLoading={isLoading}
      >
        {isLoading ? "Connecting..." : "Log in"}
      </Button>

      <p className="small-text text-center text-gray-500 mt-4">
        Don't have an account?{" "}
        <Link href="/signup" className="text-teal-600 hover:text-teal-700 underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}