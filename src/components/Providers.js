'use client';

import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '@/context/AuthProvider';
import { ToastProvider } from '@/context/ToastProvider';
import MaintenanceWrapper from '@/components/layout/MaintenanceWrapper';
/**
 * Providers component wraps the application with necessary context providers.
 *
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - The child components to wrap
 * @returns {JSX.Element} The wrapped children with providers
 */

export default function Providers({ children }) {
    return (
        <SessionProvider>
            <AuthProvider>
                <ToastProvider>
                    <MaintenanceWrapper>
                        {children}
                    </MaintenanceWrapper>
                </ToastProvider>
            </AuthProvider>
        </SessionProvider>
    );
}