'use client';

import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '@/context/AuthProvider';
import { ToastProvider } from '@/context/ToastProvider';
import MaintenanceWrapper from '@/components/layout/MaintenanceWrapper';

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