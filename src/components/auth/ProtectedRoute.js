"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { LoadingSpinner } from "@/components/ui";

/**
 * ProtectedRoute component that wraps children and redirects to login if user is not authenticated.
 * Shows loading spinner while checking authentication status.
 *
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - The content to render if authenticated
 * @returns {JSX.Element|null} The children if authenticated, loading spinner, or null
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return children;
}
