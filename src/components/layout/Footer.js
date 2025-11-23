'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Mail, Heart, ArrowUp, Rocket } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const currentYear = new Date().getFullYear();
  const appVersion = '1.0.0';
  const isSystemOperational = true;

  // Animation variants for staggered children
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    Platform: [
      { name: 'Accueil', href: '/' },
      { name: 'Articles', href: '/articles' },
      { name: 'Catégories', href: '/categories' },
      { name: 'À propos', href: '/about' },
    ],
    Resources: [
      { name: 'Contact', href: '/contact' },
      { name: 'Mentions légales', href: '#' },
      { name: 'Politique de confidentialité', href: '#' },
      { name: 'CGU', href: '#' },
    ],
  };

  const socials = [
    { icon: Github, href: 'https://github.com', name: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com', name: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com', name: 'LinkedIn' },
    { icon: Mail, href: 'mailto:contact@pixelpulse.com', name: 'Email' },
  ];

  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={container}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
        >
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <div className="flex items-center space-x-2 group">
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="p-2 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg shadow-md"
                >
                  <Rocket className="w-5 h-5 text-white" />
                </motion.div>
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-teal-600 bg-clip-text text-transparent">
                  PixelPulse
                </span>
              </div>
            </Link>
            <p className="text-gray-600 leading-relaxed">
              Votre source d'information tech de confiance. Découvrez les dernières
              tendances en IA, développement web, cybersécurité et plus encore.
            </p>
            <div className="flex space-x-4 pt-2">
              {socials.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-500 hover:text-white hover:bg-teal-100 rounded-full transition-all duration-300"
                  whileHover={{ y: -3, scale: 1.1, backgroundColor: 'rgba(13, 148, 136, 0.3)' }}
                  whileTap={{ scale: 0.9 }}
                  variants={item}
                >
                  <span className="sr-only">{social.name}</span>
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links], index) => (
            <motion.div key={title} variants={item} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link, linkIndex) => (
                  <motion.li
                    key={link.name}
                    variants={item}
                    custom={linkIndex}
                    className="overflow-hidden"
                  >
                    <Link
                      href={link.href}
                      className="group relative text-gray-600 hover:text-teal-600 transition-colors duration-300"
                    >
                      <motion.span
                        className="inline-block relative group-hover:translate-x-1 transition-transform duration-300"
                      >
                        {link.name}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 group-hover:w-full transition-all duration-300"></span>
                      </motion.span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom */}
        <motion.div
          variants={item}
          className="pt-8 mt-8 border-t border-gray-200"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              {currentYear} PixelPulse. Tous droits réservés.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
              <span className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full">
                v{appVersion}
              </span>
              <span className="inline-flex items-center">
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${isSystemOperational ? 'bg-green-500' : 'bg-red-500'
                    }`}
                />
                <span className="text-sm">
                  {isSystemOperational ? 'Status: Opérationnel' : 'En maintenance'}
                </span>
              </span>
              <motion.button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center text-teal-600 hover:text-teal-700 transition-colors group"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowUp className="w-4 h-4 mr-1 group-hover:-translate-y-0.5 transition-transform" />
                <span>Haut de page</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
