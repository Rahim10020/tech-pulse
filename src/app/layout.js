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
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${inter.variable} ${poppins.variable}`}>
      <body className="bg-gray-50 text-gray-900 antialiased suppressHydrationWarning">
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
