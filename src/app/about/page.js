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

        {/* Timeline interactive */}
        <TimelineSection />

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

// Timeline Section Interactive
function TimelineSection() {
  const milestones = [
    {
      year: "2020",
      title: "Naissance de TechPulse",
      description: "Création du blog avec une vision simple : démocratiser la tech",
      icon: "🚀",
      color: "from-blue-400 to-purple-500"
    },
    {
      year: "2021",
      title: "Première communauté",
      description: "10K lecteurs mensuels et lancement de la newsletter",
      icon: "👥",
      color: "from-green-400 to-teal-500"
    },
    {
      year: "2022",
      title: "Équipe élargie",
      description: "Recrutement d'experts et diversification des contenus",
      icon: "⭐",
      color: "from-orange-400 to-red-500"
    },
    {
      year: "2023",
      title: "Recognition internationale",
      description: "50K+ lecteurs dans 25 pays, partenariats tech",
      icon: "🌍",
      color: "from-purple-400 to-pink-500"
    },
    {
      year: "2024",
      title: "Innovation continue",
      description: "IA, cybersécurité avancée et nouvelles technologies",
      icon: "🔮",
      color: "from-cyan-400 to-blue-500"
    }
  ];

  const [activeStep, setActiveStep] = useState(0);

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
            Notre Histoire
          </motion.h2>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-300 hidden md:block">
              <motion.div
                className="bg-gradient-to-b from-teal-400 to-orange-500 w-full origin-top"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                viewport={{ once: true }}
              />
            </div>

            {/* Timeline Steps */}
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <TimelineStep
                  key={index}
                  {...milestone}
                  index={index}
                  isActive={activeStep === index}
                  onClick={() => setActiveStep(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}

function TimelineStep({ year, title, description, icon, color, index, isActive, onClick }) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      className={`relative flex items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
      initial={{ opacity: 0, x: isEven ? -100 : 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      viewport={{ once: true }}
    >
      {/* Content Card */}
      <motion.div
        className={`w-full md:w-5/12 ${isEven ? 'md:pr-8' : 'md:pl-8'}`}
        whileHover={{ scale: 1.02 }}
        onClick={onClick}
        style={{ cursor: 'pointer' }}
      >
        <motion.div
          className={`card p-6 ${isActive ? 'ring-2 ring-teal-400 shadow-lg' : ''}`}
          animate={isActive ? { scale: 1.05 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center mb-3">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${color} flex items-center justify-center text-white text-xl mr-4`}>
              {icon}
            </div>
            <div>
              <h3 className="h4-title text-gray-900">{title}</h3>
              <span className="text-teal-600 font-bold">{year}</span>
            </div>
          </div>
          <p className="body-text text-gray-600">{description}</p>
        </motion.div>
      </motion.div>

      {/* Center Dot */}
      <motion.div
        className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-white border-4 border-teal-500 hidden md:block z-10"
        whileHover={{ scale: 1.5 }}
        animate={isActive ? { scale: 1.3, borderColor: "#f97316" } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      />
    </motion.div>
  );
}

// Team Section avec carrousel
function TeamSection() {
  const teamMembers = [
    {
      name: "Sophie Martin",
      role: "Fondatrice & Rédactrice en Chef",
      bio: "Développeuse Full Stack passionnée par l'IA et les nouvelles technologies. 8 ans d'expérience en développement web moderne.",
      detailedBio: "Sophie a fondé TechPulse avec une vision claire : rendre la technologie accessible à tous. Diplômée en informatique de l'École Polytechnique, elle a travaillé chez Google et Microsoft avant de se lancer dans l'entrepreneuriat. Experte en React, Node.js et intelligence artificielle, elle écrit principalement sur les frameworks modernes et les tendances emerging tech.",
      avatar: "SM",
      specialties: ["React", "Node.js", "IA", "Leadership"],
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
      detailedBio: "Thomas est un ancien consultant en cybersécurité pour des institutions bancaires européennes. Certifié CISSP et CEH, il a dirigé des équipes de response d'incident et de penetration testing. Chez TechPulse, il démystifie les concepts de sécurité et partage les meilleures pratiques pour protéger applications et données.",
      avatar: "TD",
      specialties: ["Pentest", "SOC", "Forensics", "GDPR"],
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
      detailedBio: "Clara combine design et développement pour créer des expériences utilisateur exceptionnelles. Formée aux Gobelins puis en autodidacte sur les technologies web, elle maîtrise Figma, React, Vue.js et les principes d'accessibilité. Elle écrit sur l'UX/UI, les animations web et les dernières tendances design.",
      avatar: "CD",
      specialties: ["React", "Vue.js", "UX/UI", "Figma"],
      social: {
        github: "#",
        twitter: "#",
        linkedin: "#"
      }
    },
    {
      name: "Marc Rousseau",
      role: "Expert DevOps & Cloud",
      bio: "Architecte cloud et spécialiste DevOps, il optimise les infrastructures et automatise les déploiements.",
      detailedBio: "Marc a 12 ans d'expérience dans l'infrastructure et le cloud computing. Il a migré des centaines d'applications vers AWS, Azure et GCP. Expert Kubernetes et Terraform, il prône l'Infrastructure as Code et l'automatisation. Ses articles couvrent DevOps, microservices, monitoring et bonnes pratiques cloud.",
      avatar: "MR",
      specialties: ["AWS", "Kubernetes", "Terraform", "CI/CD"],
      social: {
        github: "#",
        twitter: "#",
        linkedin: "#"
      }
    },
    {
      name: "Léa Chen",
      role: "Data Scientist",
      bio: "Spécialisée en machine learning et analyse de données, elle explore l'IA appliquée au quotidien.",
      detailedBio: "Léa possède un PhD en informatique de Sorbonne Université, spécialisée en apprentissage automatique. Elle a travaillé dans la recherche chez Facebook AI avant de rejoindre des startups fintech. Elle vulgarise les concepts de ML, deep learning, NLP et computer vision pour les rendre accessibles aux développeurs.",
      avatar: "LC",
      specialties: ["Python", "TensorFlow", "ML", "Data Viz"],
      social: {
        github: "#",
        twitter: "#",
        linkedin: "#"
      }
    }
  ];

  const [currentMember, setCurrentMember] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const nextMember = () => {
    setCurrentMember((prev) => (prev + 1) % teamMembers.length);
  };

  const prevMember = () => {
    setCurrentMember((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

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

          {/* Carrousel Desktop */}
          <div className="hidden md:block">
            <div className="relative overflow-hidden">
              <motion.div
                className="flex transition-transform duration-500 ease-in-out"
                animate={{ x: -currentMember * (100 / 3) + '%' }}
                style={{ width: `${(teamMembers.length / 3) * 100}%` }}
              >
                {teamMembers.map((member, index) => (
                  <div key={index} className="w-1/3 px-4">
                    <TeamMemberCard
                      {...member}
                      delay={0}
                      onViewDetails={() => {
                        setCurrentMember(index);
                        setShowModal(true);
                      }}
                    />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center items-center mt-8 space-x-4">
              <motion.button
                onClick={prevMember}
                className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ←
              </motion.button>

              <div className="flex space-x-2">
                {teamMembers.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentMember(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${index >= currentMember && index < currentMember + 3
                      ? 'bg-teal-500'
                      : 'bg-gray-300'
                      }`}
                    whileHover={{ scale: 1.2 }}
                  />
                ))}
              </div>

              <motion.button
                onClick={nextMember}
                className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                →
              </motion.button>
            </div>
          </div>

          {/* Grid Mobile */}
          <div className="md:hidden grid gap-8">
            {teamMembers.map((member, index) => (
              <TeamMemberCard
                key={index}
                {...member}
                delay={index * 0.2}
                onViewDetails={() => {
                  setCurrentMember(index);
                  setShowModal(true);
                }}
              />
            ))}
          </div>

          {/* Modal biographie */}
          <TeamMemberModal
            member={teamMembers[currentMember]}
            isOpen={showModal}
            onClose={() => setShowModal(false)}
          />
        </div>
      </section>
    </AnimatedSection>
  );
}

function TeamMemberCard({ name, role, bio, avatar, social, specialties, delay, onViewDetails }) {
  return (
    <motion.div
      className="card p-6 text-center hover:shadow-lg transition-shadow relative overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      {/* Gradient overlay au hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-orange-500/10 opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative z-10">
        <motion.div
          className="w-20 h-20 bg-gradient-to-br from-teal-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4"
          whileHover={{ scale: 1.1, rotate: 5 }}
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
        <p className="body-text text-gray-600 mb-4 line-clamp-3">
          {bio}
        </p>

        {/* Spécialités */}
        {specialties && (
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {specialties.slice(0, 3).map((skill, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Bouton Voir plus */}
        <motion.button
          onClick={onViewDetails}
          className="mb-4 text-teal-600 hover:text-teal-700 text-sm font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          En savoir plus →
        </motion.button>

        {/* Social links */}
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
      </div>
    </motion.div>
  );
}

// Modal pour les biographies détaillées
function TeamMemberModal({ member, isOpen, onClose }) {
  if (!isOpen || !member) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-orange-500 rounded-full flex items-center justify-center mr-4">
              <span className="text-white font-bold text-xl">
                {member.avatar}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="h3-title text-gray-900 mb-1">
                {member.name}
              </h3>
              <p className="text-teal-600 h5-title">
                {member.role}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Bio détaillée */}
          <div className="mb-6">
            <h4 className="h4-title text-gray-900 mb-3">Biographie</h4>
            <p className="body-text text-gray-700 leading-relaxed">
              {member.detailedBio}
            </p>
          </div>

          {/* Spécialités */}
          <div className="mb-6">
            <h4 className="h4-title text-gray-900 mb-3">Spécialités</h4>
            <div className="flex flex-wrap gap-2">
              {member.specialties?.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="h4-title text-gray-900 mb-3">Suivre {member.name.split(' ')[0]}</h4>
            <div className="flex gap-4">
              {Object.entries(member.social).map(([platform, url]) => {
                const icons = {
                  github: Github,
                  twitter: Twitter,
                  linkedin: Linkedin
                };
                const Icon = icons[platform];
                const labels = {
                  github: 'GitHub',
                  twitter: 'Twitter',
                  linkedin: 'LinkedIn'
                };

                return (
                  <motion.a
                    key={platform}
                    href={url}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{labels[platform]}</span>
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
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