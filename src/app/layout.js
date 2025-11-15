// src/app/layout.js - Layout AVEC AuthProvider
import "./globals.css";
import Providers from "@/components/Providers";
import { Analytics } from "@vercel/analytics/react";

// Using system fonts as fallback to avoid Google Fonts network issues during build
const inter = {
  variable: "--font-inter",
  className: "",
};

const poppins = {
  variable: "--font-poppins",
  className: "",
};

export const metadata = {
  title: "pixelpulse - Blog Tech",
  description: "Blog technologique moderne",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 antialiased transition-colors duration-300" suppressHydrationWarning>
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
