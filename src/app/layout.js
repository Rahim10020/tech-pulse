// src/app/layout.js - Layout AVEC AuthProvider
import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/context/AuthProvider'

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
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
