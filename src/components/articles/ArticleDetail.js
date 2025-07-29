// src/components/articles/ArticleDetail.js - Refait selon l'image
import Link from 'next/link';
import { Heart, MessageCircle } from 'lucide-react';

export default function ArticleDetail({ article }) {
  if (!article) {
    return (
      <div className="container-sm py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article non trouvé</h1>
          <Link href="/articles" className="btn-primary">
            Retour aux articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 font-poppins">
          <Link href="/" className="hover:text-gray-700">Accueil</Link>
          <span className="mx-2">/</span>
          <Link href="/articles" className="hover:text-gray-700">Articles</Link>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight font-sans">
            {article.title}
          </h1>
          
          {/* Author & Meta */}
          <div className="flex items-center text-sm text-gray-600 mb-6 font-sans">
            <span>Publié par </span>
            <Link 
              href={`/author/${article.author.id}`}
              className="mx-1 text-gray-900 hover:text-teal-600 transition-colors font-medium"
            >
              {article.author.name}
            </Link>
            <span className="mx-2">•</span>
            <span>{new Date(article.publishedAt).toLocaleDateString('fr-FR')}</span>
            <span className="mx-2">•</span>
            <span>{article.readTime} de lecture</span>
          </div>
        </header>

        {/* Article Image */}
        <div className="mb-8">
          <div className="w-full h-96 bg-gradient-to-br from-teal-400 via-teal-500 to-green-600 rounded-md flex items-center justify-center">
            {/* Placeholder pour l'image de l'article */}
            <div className="text-white text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="bg-transparent p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6 font-sans">
              {article.description}
            </p>
            
            <div className="space-y-6 text-gray-700 font-sans">
              <p className="leading-relaxed">
                L'intelligence artificielle (IA) est en train de remodeler le paysage technologique à un rythme sans précédent. De l'automatisation des tâches routinières à la création de solutions innovantes, l'IA a le potentiel de transformer radicalement de nombreux secteurs. Cet article explore les tendances actuelles de l'IA et leurs impacts potentiels sur l'industrie.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                Tendances actuelles de l'IA
              </h2>
              
              <p className="leading-relaxed">
                Plusieurs tendances clés façonnent le développement de l'IA aujourd'hui. L'apprentissage automatique (machine learning) permet aux systèmes d'apprendre à partir de données sans être explicitement programmés. L'apprentissage profond (deep learning), une sous-catégorie de l'apprentissage automatique, utilise des réseaux de neurones artificiels pour analyser des données complexes. Le traitement du langage naturel (NLP) permet aux machines de comprendre et de générer du langage humain. Enfin, la vision par ordinateur permet aux systèmes de "voir" et d'interpréter des images et des vidéos.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                Impacts sur l'industrie
              </h2>
              
              <p className="leading-relaxed">
                L'IA a des implications majeures pour de nombreux secteurs. Dans la santé, elle peut aider à diagnostiquer des maladies, à développer de nouveaux traitements et à personnaliser les soins aux patients. Dans la finance, l'IA peut être utilisée pour la détection de fraude, la gestion des risques et le trading algorithmique. Dans le commerce de détail, elle peut améliorer l'expérience client, optimiser les chaînes d'approvisionnement et prédire les tendances du marché. L'IA a également un impact sur la fabrication, les transports, l'agriculture et bien d'autres domaines.
              </p>
            </div>
          </div>
        </div>

        {/* Actions & Comments */}
        <div className="bg-transparent p-6">
          {/* Actions */}
          <div className="flex items-center space-x-6 mb-8 pb-6 border-b border-gray-200">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors font-sans">
              <Heart className="w-5 h-5" />
              <span>{article.likes}</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors font-sans">
              <MessageCircle className="w-5 h-5" />
              <span>{article.comments?.length || 0}</span>
            </button>
          </div>

          {/* Comments Section */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6 font-sans">
              Commentaires
            </h3>
            
            {/* Comments List */}
            <div className="space-y-6">
              {/* Comment 1 */}
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex-shrink-0 flex items-center justify-center">
                  <span className="text-white font-medium text-sm font-sans">J</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-gray-900 font-sans">Jean Dupont</span>
                    <span className="text-sm text-gray-500 font-sans">2 jours</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed font-sans">
                    Excellent article, Sophie ! J'ai particulièrement apprécié la clarté avec laquelle vous avez expliqué les différentes tendances de l'IA.
                  </p>
                </div>
              </div>

              {/* Comment 2 */}
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-400 rounded-full flex-shrink-0 flex items-center justify-center">
                  <span className="text-white font-medium text-sm font-poppins">M</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-gray-900 font-sans">Marie Dubois</span>
                    <span className="text-sm text-gray-500 font-sans">1 jour</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed font-sans">
                    Merci pour cet aperçu complet. Je suis curieuse de voir comment l'IA va continuer à évoluer dans les années à venir.
                  </p>
                </div>
              </div>
            </div>

            {/* Comment Form */}
            <div className="mt-8">
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex-shrink-0 flex items-center justify-center">
                  <span className="text-white font-medium text-sm font-poppins">U</span>
                </div>
                <div className="flex-1">
                  <textarea
                    placeholder="Ajouter un commentaire..."
                    className="w-full p-3 border-2 border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent font-sans"
                    rows="3"
                  />
                  <div className="mt-3 flex justify-end">
                    <button className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-poppins">
                      Envoyer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}