// src/app/admin/layout.js - Layout pour les pages d'administration avec vérification auth
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { getUserById } from '@/lib/auth-db';
import { isAdmin } from '@/lib/auth-roles';

export const metadata = {
  title: 'Administration - TechPulse',
  description: 'Panneau d\'administration pour la gestion du site TechPulse',
};

export default async function AdminLayout({ children }) {
  // Vérifier l'authentification côté serveur
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/secret-admin-access');
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      redirect('/secret-admin-access');
    }

    const user = await getUserById(decoded.userId);
    if (!user || !isAdmin(user)) {
      redirect('/secret-admin-access');
    }
  } catch (error) {
    console.error('Admin layout auth error:', error);
    redirect('/secret-admin-access');
  }

  return (
    <>
      {children}
    </>
  );
}