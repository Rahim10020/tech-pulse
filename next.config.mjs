// next.config.mjs - MODIFIEZ votre fichier existant
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com', 'blob.vercel-storage.com'],
  },
  // Configuration importante pour Tailwind
  transpilePackages: [],
  eslint: {
    // Activer la validation ESLint pendant les builds pour assurer la qualité du code
    ignoreDuringBuilds: false,
    dirs: ['src/app', 'src/lib', 'src/components', 'src/context']
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;