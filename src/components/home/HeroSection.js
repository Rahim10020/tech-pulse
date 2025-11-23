'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, TrendingUp, Users, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const { scrollY } = useScroll();

  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const stats = [
    { icon: BookOpen, value: '500+', label: 'Articles' },
    { icon: Users, value: '10K+', label: 'Lecteurs' },
    { icon: TrendingUp, value: '50+', label: 'Auteurs' },
  ];

  return (
    <motion.section
      ref={heroRef}
      style={{ y, opacity }}
      className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-teal-50/30 to-orange-50/20 py-20 md:py-40"
    >
      {/* Animated gradient orbs with reduced opacity */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-teal-400/10"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-400/10"
        />
      </div>

      {/* Parallax particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-teal-500/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              x: mousePosition.x * (i * 2),
              y: mousePosition.y * (i * 2),
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm border border-gray-100"
          >
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-700">
              La plateforme tech de référence
            </span>
          </motion.div>

          {/* Main title with gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-poppins leading-tight"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-teal-600 to-orange-500">
              Explorez le futur
            </span>
            <span className="block text-gray-900 mt-2">
              de la technologie
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Découvrez des articles de qualité sur l&apos;IA, le développement web,
            la cybersécurité et bien plus encore.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-8 mb-12"
          >
            <Link href="/articles" className="block">
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 10px 25px -5px rgba(20, 184, 166, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                className="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white rounded-full font-semibold text-base sm:text-lg shadow-md flex items-center gap-2 transition-all duration-300"
              >
                Explorer les articles
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link href="/about" className="block">
              <motion.button
                whileHover={{
                  scale: 1.03,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
                whileTap={{ scale: 0.98 }}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white/90 backdrop-blur-sm text-gray-800 hover:text-gray-900 border border-gray-200 rounded-full font-medium text-base sm:text-lg shadow-sm flex items-center gap-2 transition-all duration-300"
              >
                En savoir plus
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Wave separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-12 md:h-24 text-gray-50"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C300,100 900,0 1200,50 L1200,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </motion.section>
  );
}
