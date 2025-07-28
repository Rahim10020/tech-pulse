// app/layout.js - Layout AVEC les providers (à utiliser après avoir créé les fichiers)
import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/context/AuthProvider'
import { ToastProvider } from '@/context/ToastProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TechPulse - Blog Tech',
  description: 'Blog technologique moderne',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={inter.className}>
      <body className="bg-gray-50 text-gray-900 antialiased">
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}