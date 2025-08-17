// src/app/about/page.js - Page About avec animations Framer Motion
"use client";

import { motion, useInView, useAnimation } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import { Code, Users, Target, Award, ArrowRight, Github, Twitter, Linkedin } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        {/* Hero Section avec animation */}
        <HeroSection />

        {/* Stats Section avec compteurs animés */}
        <StatsSection />

        {/* Mission Section */}
        <MissionSection />

        {/* Values Section avec cards animées */}
        <ValuesSection />

        {/* Team Section avec hover effects */}
        <TeamSection />

        {/* CTA Section */}
        <CTASection />
      </main>
    </div>
  );
}

// Component pour les animations au scroll
function AnimatedSection({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Hero Section avec animation d'entrée
function HeroSection() {
  return (
    <section className="bg-white py-10">
      <div className="container-sm">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="h1-title text-gray-900 mb-6"
          >
            À propos de <span className="text-teal-600">TechPulse</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h4-title text-gray-600 mb-8"
          >
            Votre source de référence pour rester à la pointe de la technologie.
            Nous partageons les dernières tendances, tutoriels et analyses dans le monde du développement,
            de l'intelligence artificielle et de la cybersécurité.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <motion.a
              href="/articles"
              className="btn-primary flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Découvrir nos articles
              <ArrowRight className="w-4 h-4 ml-2" />
            </motion.a>
            <motion.a
              href="/contact"
              className="btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Nous contacter
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Stats Section avec compteurs animés
function StatsSection() {
  const stats = [
    { label: "Articles publiés", value: 150, suffix: "+" },
    { label: "Lecteurs mensuels", value: 50, suffix: "K+" },
    { label: "Pays couverts", value: 25, suffix: "+" },
    { label: "Années d'expérience", value: 5, suffix: "+" }
  ];

  return (
    <AnimatedSection>
      <section className="py-16 bg-gray-100">
        <div className="container-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <StatCounter
                key={index}
                {...stat}
                delay={index * 0.2}
              />
            ))}
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}

// Compteur animé pour les stats
function StatCounter({ label, value, suffix, delay }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ scale: 0.5, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <motion.div
        className="h2-title text-gray-900 mb-2"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 2, delay: delay + 0.5 }}
      >
        <AnimatedCounter value={value} suffix={suffix} isInView={isInView} />
      </motion.div>
      <div className="body-text text-gray-600">{label}</div>
    </motion.div>
  );
}

// Composant pour animer les chiffres
function AnimatedCounter({ value, suffix, isInView }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const duration = 2000; // 2 secondes
    const increment = end / (duration / 16); // 60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return <span>{count}{suffix}</span>;
}

// Mission Section
function MissionSection() {
  return (
    <AnimatedSection>
      <section className="py-20 bg-white">
        <div className="container-sm">
          <motion.h2
            className="h2-title text-gray-900 mb-8 text-center"
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Notre Mission
          </motion.h2>
          <div className="text-center">
            <motion.p
              className="h4-title text-gray-600 mb-8"
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Chez TechPulse, nous croyons que la technologie doit être accessible à tous.
              Notre mission est de démocratiser les connaissances techniques en proposant
              du contenu de qualité, des tutoriels pratiques et des analyses approfondies.
            </motion.p>
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <MissionCard
                title="Ce que nous faisons"
                items={[
                  "Articles techniques approfondis",
                  "Tutoriels pas-à-pas",
                  "Analyses des dernières tendances",
                  "Guides pour débutants et experts"
                ]}
                color="teal"
                delay={0.3}
              />
              <MissionCard
                title="Nos domaines d'expertise"
                items={[
                  "Développement Web et Mobile",
                  "Intelligence Artificielle",
                  "Cybersécurité",
                  "Cloud Computing"
                ]}
                color="orange"
                delay={0.5}
              />
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}

function MissionCard({ title, items, color, delay }) {
  return (
    <motion.div
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
    >
      <h3 className="h3-title text-gray-900 mb-4">
        {title}
      </h3>
      <ul className="space-y-3 text-gray-700">
        {items.map((item, i) => (
          <motion.li
            key={i}
            className="flex items-start"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: delay + (i * 0.1) }}
            viewport={{ once: true }}
          >
            <span className={`w-2 h-2 bg-${color}-500 rounded-full mt-2 mr-3 flex-shrink-0`}></span>
            <span className="body-text">{item}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

// Values Section avec animations de cartes
function ValuesSection() {
  const values = [
    {
      icon: <Code className="w-8 h-8 text-teal-600" />,
      title: "Excellence Technique",
      description: "Nous nous engageons à fournir un contenu technique de la plus haute qualité, vérifié par nos experts."
    },
    {
      icon: <Users className="w-8 h-8 text-orange-500" />,
      title: "Communauté",
      description: "Nous croyons en la force de la communauté pour partager les connaissances et faire progresser la technologie."
    },
    {
      icon: <Target className="w-8 h-8 text-blue-500" />,
      title: "Innovation",
      description: "Nous explorons constamment les dernières tendances pour vous tenir informé des évolutions technologiques."
    },
    {
      icon: <Award className="w-8 h-8 text-green-500" />,
      title: "Pédagogie",
      description: "Nous rendons les concepts complexes accessibles à tous, du débutant à l'expert confirmé."
    }
  ];

  return (
    <AnimatedSection>
      <section className="py-20 bg-gray-50">
        <div className="container-sm">
          <motion.h2
            className="h2-title text-gray-900 mb-12 text-center"
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Nos Valeurs
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <ValueCard key={index} {...value} delay={index * 0.2} />
            ))}
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}

function ValueCard({ icon, title, description, delay }) {
  return (
    <motion.div
      className="text-center card p-6 h-full"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      whileHover={{
        y: -10,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
    >
      <motion.div
        className="mb-4 flex justify-center"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {icon}
      </motion.div>
      <h3 className="h4-title text-gray-900 mb-3">
        {title}
      </h3>
      <p className="body-text text-gray-600">
        {description}
      </p>
    </motion.div>
  );
}

// Team Section avec hover effects
function TeamSection() {
  const teamMembers = [
    {
      name: "Sophie Martin",
      role: "Fondatrice & Rédactrice en Chef",
      bio: "Développeuse Full Stack passionnée par l'IA et les nouvelles technologies. 8 ans d'expérience en développement web moderne.",
      avatar: "SM",
      social: {
        github: "#",
        twitter: "#",
        linkedin: "#"
      }
    },
    {
      name: "Thomas Dubois",
      role: "Expert Cybersécurité",
      bio: "Spécialiste en sécurité informatique avec plus de 10 ans d'expérience dans la protection des systèmes critiques.",
      avatar: "TD",
      social: {
        github: "#",
        twitter: "#",
        linkedin: "#"
      }
    },
    {
      name: "Clara Dupont",
      role: "Développeuse Frontend",
      bio: "Experte en interfaces utilisateur modernes et en expérience utilisateur. Passionnée par React et les nouvelles technologies web.",
      avatar: "CD",
      social: {
        github: "#",
        twitter: "#",
        linkedin: "#"
      }
    }
  ];

  return (
    <AnimatedSection>
      <section className="py-20 bg-white">
        <div className="container-sm">
          <motion.h2
            className="h2-title text-gray-900 mb-12 text-center"
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Notre Équipe
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={index} {...member} delay={index * 0.2} />
            ))}
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}

function TeamMemberCard({ name, role, bio, avatar, social, delay }) {
  return (
    <motion.div
      className="card p-6 text-center hover:shadow-lg transition-shadow"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <motion.div
        className="w-20 h-20 bg-gradient-to-br from-teal-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <span className="text-white font-bold text-lg">
          {avatar}
        </span>
      </motion.div>
      <h3 className="h4-title text-gray-900 mb-2">
        {name}
      </h3>
      <p className="text-teal-600 h5-title mb-3">
        {role}
      </p>
      <p className="body-text text-gray-600 mb-4">
        {bio}
      </p>
      <div className="flex justify-center gap-3">
        {Object.entries(social).map(([platform, url]) => {
          const icons = {
            github: Github,
            twitter: Twitter,
            linkedin: Linkedin
          };
          const Icon = icons[platform];

          return (
            <motion.a
              key={platform}
              href={url}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              whileHover={{ scale: 1.2, y: -2 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Icon className="w-5 h-5" />
            </motion.a>
          );
        })}
      </div>
    </motion.div>
  );
}

// CTA Section avec animations
function CTASection() {
  return (
    <AnimatedSection>
      <section className="py-20 bg-gradient-to-r from-teal-500 to-orange-500">
        <div className="container-sm text-center">
          <motion.h2
            className="h2-title text-white mb-6"
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Rejoignez la Communauté TechPulse
          </motion.h2>
          <motion.p
            className="h4-title text-white/90 mb-8"
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Restez informé des dernières tendances technologiques et
            accédez à du contenu exclusif en rejoignant notre communauté.
          </motion.p>
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.a
              href="/articles"
              className="bg-white text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Découvrir les articles
            </motion.a>
            <motion.a
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-gray-900 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Nous contacter
            </motion.a>
          </motion.div>
        </div>
      </section>
    </AnimatedSection>
  );
}