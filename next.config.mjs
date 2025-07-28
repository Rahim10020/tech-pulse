// next.config.mjs - MODIFIÉ pour TechPulse
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Optimisations pour App Router
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    // Configuration pour les images optimisées
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  // Support pour les imports absolus
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': '.',
    };
    return config;
  },
};

export default nextConfig;