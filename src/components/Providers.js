'use client';

import { AuthProvider } from '@/context/AuthProvider';
import { ToastProvider } from '@/context/ToastProvider';
import MaintenanceWrapper from '@/components/layout/MaintenanceWrapper';
/**
 * Providers component wraps the application with necessary context providers.
 *
 * Note: NextAuth is used only for Google OAuth (configured in lib/auth.js).
 * The AuthProvider handles JWT-based authentication for email/password login.
 *
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - The child components to wrap
 * @returns {JSX.Element} The wrapped children with providers
 */

export default function Providers({ children }) {
    return (
        <AuthProvider>
            <ToastProvider>
                <MaintenanceWrapper>
                    {children}
                </MaintenanceWrapper>
            </ToastProvider>
        </AuthProvider>
    );
}