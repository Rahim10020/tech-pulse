'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Mail, Heart, ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  const socialLinks = [
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:contact@pixelpulse.com', label: 'Email' },
  ];

  return (
    <footer className="bg-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <motion.img
                whileHover={{ scale: 1.05 }}
                src="/logo.png"
                alt="PixelPulse"
                className="h-10"
              />
            </Link>
            <p className="text-gray-600">
              Votre source d'information tech de confiance. Découvrez les dernières tendances en IA,
              développement web, cybersécurité et plus encore.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-gray-100"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-gray-900">
                {title}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-600"
                    >
                      <motion.span whileHover={{ x: 4 }} className="inline-block">
                        {link.name}
                      </motion.span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} PixelPulse. Made with
              <Heart className="w-4 h-4 text-red-500 fill-red-500 inline" />
              by our team
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Version 1.0.0</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full" />
              <span>Status: <span className="text-green-500">Operational</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-teal-600 hover:bg-teal-700"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Retour en haut"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </footer>
  );
}
