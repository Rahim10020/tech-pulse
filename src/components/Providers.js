'use client';

import { AuthProvider } from '@/context/AuthProvider';
import { ToastProvider } from '@/context/ToastProvider';
import MaintenanceWrapper from '@/components/layout/MaintenanceWrapper';

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