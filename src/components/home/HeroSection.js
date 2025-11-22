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
      className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-teal-50/30 to-orange-50/20"
    >
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-teal-400/20"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-400/20"
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

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/80"
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
            className="text-5xl md:text-7xl font-bold mb-6 font-poppins"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-teal-600 to-orange-500">
              Explorez le futur
            </span>
            <br />
            <span className="text-gray-900">
              de la technologie
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600"
          >
            Découvrez des articles de qualité sur l'IA, le développement web,
            la cybersécurité et bien plus encore.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link href="/articles">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(20, 184, 166, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white rounded-full font-semibold text-lg shadow-lg flex items-center gap-2 transition-all"
              >
                Explorer les articles
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link href="/about">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white"
              >
                En savoir plus
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/60"
              >
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 bg-gradient-to-br from-teal-500 to-teal-600">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </motion.div>
            ))}
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
