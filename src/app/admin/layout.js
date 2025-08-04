// src/app/admin/layout.js - Layout pour les pages d'administration
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Administration - TechPulse',
  description: 'Panneau d\'administration pour la gestion du site TechPulse',
};

export default function AdminLayout({ children }) {
  return (
    <>
      {children}
    </>
  );
}