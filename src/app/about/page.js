// src/app/about/page.js - Page "À propos" de TechPulse
import Header from '@/components/layout/Header';
import { Code, Users, Target, Award, ArrowRight, Github, Twitter, Linkedin } from 'lucide-react';

export const metadata = {
  title: 'À propos - TechPulse',
  description: 'Découvrez TechPulse, votre blog technologique de référence pour rester à jour avec les dernières tendances en développement, IA et cybersécurité.',
};

export default function AboutPage() {
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

  const stats = [
    { label: "Articles publiés", value: "150+" },
    { label: "Lecteurs mensuels", value: "50K+" },
    { label: "Pays couverts", value: "25+" },
    { label: "Années d'expérience", value: "5+" }
  ];

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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-white py-10">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-poppins font-bold text-gray-900 mb-6">
                À propos de <span className="text-teal-600">TechPulse</span>
              </h1>
              <p className="text-xl font-poppins text-gray-600 mb-8 leading-relaxed">
                Votre source de référence pour rester à la pointe de la technologie. 
                Nous partageons les dernières tendances, tutoriels et analyses dans le monde du développement, 
                de l'intelligence artificielle et de la cybersécurité.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/articles" className="btn-primary flex items-center font-poppins">
                  Découvrir nos articles
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
                <a href="/contact" className="btn-secondary font-poppins">
                  Nous contacter
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-100">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-poppins font-bold text-gray-900 mb-8 text-center">
                Notre Mission
              </h2>
              <div className="prose prose-lg mx-auto text-gray-700">
                <p className="text-center text-xl leading-relaxed mb-8">
                  Chez TechPulse, nous croyons que la technologie doit être accessible à tous. 
                  Notre mission est de démocratiser les connaissances techniques en proposant 
                  du contenu de qualité, des tutoriels pratiques et des analyses approfondies.
                </p>
                <div className="grid md:grid-cols-2 gap-8 mt-12">
                  <div>
                    <h3 className="text-xl font-poppins font-semibold text-gray-900 mb-4">
                      Ce que nous faisons
                    </h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Articles techniques approfondis
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Tutoriels pas-à-pas
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Analyses des dernières tendances
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Guides pour débutants et experts
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-poppins font-semibold text-gray-900 mb-4">
                      Nos domaines d'expertise
                    </h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Développement Web et Mobile
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Intelligence Artificielle
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Cybersécurité
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Cloud Computing
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gray-50">
          <div className="container">
            <h2 className="text-3xl font-poppins font-bold text-gray-900 mb-12 text-center">
              Nos Valeurs
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center">
                  <div className="mb-4 flex justify-center">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-poppins font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-white">
          <div className="container">
            <h2 className="text-3xl font-poppins font-bold text-gray-900 mb-12 text-center">
              Notre Équipe
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {teamMembers.map((member, index) => (
                <div key={index} className="card p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">
                      {member.avatar}
                    </span>
                  </div>
                  <h3 className="text-xl font-poppins font-semibold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-teal-600 font-poppins font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 font-poppins text-sm leading-relaxed mb-4">
                    {member.bio}
                  </p>
                  <div className="flex justify-center space-x-3">
                    <a href={member.social.github} className="text-gray-400 hover:text-gray-600 transition-colors">
                      <Github className="w-5 h-5" />
                    </a>
                    <a href={member.social.twitter} className="text-gray-400 hover:text-gray-600 transition-colors">
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a href={member.social.linkedin} className="text-gray-400 hover:text-gray-600 transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-teal-500 to-orange-500">
          <div className="container text-center">
            <h2 className="text-3xl font-poppins font-bold text-white mb-6">
              Rejoignez la Communauté TechPulse
            </h2>
            <p className="text-xl font-poppins text-white/90 mb-8 max-w-2xl mx-auto">
              Restez informé des dernières tendances technologiques et 
              accédez à du contenu exclusif en rejoignant notre communauté.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/signup" className="bg-white text-gray-900 px-8 py-3 rounded-lg font-poppins font-medium hover:bg-gray-100 transition-colors">
                Créer un compte
              </a>
              <a href="/articles" className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white font-poppins hover:text-gray-900 transition-colors">
                Découvrir les articles
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}