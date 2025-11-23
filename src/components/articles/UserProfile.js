"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthProvider';
import { Shield, MapPin, Globe, ExternalLink, Calendar, Twitter, Linkedin, Github, Settings, LogOut, Eye, Heart, MessageCircle } from 'lucide-react';

/**
 * UserProfile component displays a user's profile with articles, comments, likes, and profile management.
 *
 * @param {Object} props - The component props
 * @param {Object} props.user - The user object with profile information
 * @param {Array} props.articles - Array of articles published by the user
 * @returns {JSX.Element} The user profile element
 */
export default function UserProfile({ user, articles }) {
  const [activeTab, setActiveTab] = useState("articles");
  const { currentUser, logout } = useAuth();
  const [userComments, setUserComments] = useState([]);
  const [userLikes, setUserLikes] = useState([]);
  const [loading, setLoading] = useState(false);

  const isOwnProfile = currentUser && currentUser.id === user.id;

  const handleLogout = () => {
    logout();
  };

  // Charger les commentaires de l'utilisateur
  const loadUserComments = useCallback(async () => {
    if (activeTab !== "comments") return;
    setLoading(true);
    try {
      const response = await fetch(`/api/auth/profile/comments/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setUserComments(data.comments || []);
      }
    } catch (error) {
      console.error('Erreur chargement commentaires:', error);
    } finally {
      setLoading(false);
    }
  }, [user.id, activeTab]);

  // Charger les likes de l'utilisateur
  const loadUserLikes = useCallback(async () => {
    if (activeTab !== "likes") return;
    setLoading(true);
    try {
      const response = await fetch(`/api/auth/profile/likes/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setUserLikes(data.likes || []);
      }
    } catch (error) {
      console.error('Erreur chargement likes:', error);
    } finally {
      setLoading(false);
    }
  }, [user.id, activeTab]);

  useEffect(() => {
    if (activeTab === "comments") {
      loadUserComments();
    } else if (activeTab === "likes") {
      loadUserLikes();
    }
  }, [activeTab, loadUserComments, loadUserLikes]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar - Profil utilisateur */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
            {/* Avatar et nom */}
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h1 className="h3-title text-gray-900 mb-1">
                {user.name}
              </h1>
              <p className="body-text text-gray-600">@{user.username}</p>
              {user.role === "admin" && (
                <div className="flex items-center justify-center mt-2">
                  <Shield className="w-4 h-4 text-teal-600 mr-1" />
                  <span className="small-text text-teal-600 font-medium">
                    Administrateur
                  </span>
                </div>
              )}
            </div>

            {/* Bio */}
            {user.bio && (
              <div className="mb-6">
                <p className="body-text text-gray-700 leading-relaxed">
                  {user.bio}
                </p>
              </div>
            )}

            {/* Statistiques */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="h4-title text-gray-900">
                  {articles.length}
                </div>
                <div className="small-text text-gray-500">
                  Articles
                </div>
              </div>
              <div className="text-center">
                <div className="h4-title text-gray-900">
                  {articles
                    .reduce((total, article) => total + (article.views || 0), 0)
                    .toLocaleString()}
                </div>
                <div className="small-text text-gray-500">
                  Vues totales
                </div>
              </div>
              <div className="text-center">
                <div className="h4-title text-gray-900">
                  {articles.reduce(
                    (total, article) => total + (article.likes || 0),
                    0
                  )}
                </div>
                <div className="small-text text-gray-500">
                  Likes reçus
                </div>
              </div>
            </div>

            {/* Informations personnelles */}
            <div className="space-y-3 mb-6">
              {user.location && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-gray-600" />
                  <span className="body-text text-gray-600">{user.location}</span>
                </div>
              )}

              {user.website && (
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-2 text-gray-600" />
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="body-text text-teal-600 hover:text-teal-700 transition-colors flex items-center"
                  >
                    {user.website.replace(/^https?:\/\//, "")}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              )}

              {user.createdAt && (
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-600" />
                  <span className="body-text text-gray-600">
                    Rejoint en{" "}
                    {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* Réseaux sociaux */}
            {(user.twitter || user.linkedin || user.github) && (
              <div className="border-t pt-4">
                <h3 className="h5-title text-gray-900 mb-3">
                  Réseaux sociaux
                </h3>
                <div className="flex space-x-3">
                  {user.twitter && (
                    <a
                      href={
                        user.twitter.startsWith("http")
                          ? user.twitter
                          : `https://twitter.com/${user.twitter.replace(
                            "@",
                            ""
                          )}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                      title="Twitter"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {user.linkedin && (
                    <a
                      href={
                        user.linkedin.startsWith("http")
                          ? user.linkedin
                          : `https://linkedin.com/in/${user.linkedin}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {user.github && (
                    <a
                      href={
                        user.github.startsWith("http")
                          ? user.github
                          : `https://github.com/${user.github}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
                      title="GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Actions pour le profil personnel */}
            {isOwnProfile && (
              <div className="border-t pt-4 space-y-3">
                <Link
                  href="/profile/edit"
                  className="flex items-center justify-center w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Modifier le profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Contenu principal */}
        <div className="lg:col-span-2">
          {/* Header avec onglets */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab("articles")}
                className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors ${activeTab === "articles"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                <span className="h6-title">
                  Articles publiés ({articles.length})
                </span>
              </button>
              <button
                onClick={() => setActiveTab("comments")}
                className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors ${activeTab === "comments"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                <span className="h6-title">
                  Commentaires
                </span>
              </button>
              <button
                onClick={() => setActiveTab("likes")}
                className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors ${activeTab === "likes"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                <span className="h6-title">
                  Likes ({userLikes.length})
                </span>
              </button>
            </nav>
          </div>

          {/* Contenu des onglets */}
          <div>
            {/* Articles */}
            {activeTab === "articles" && (
              <div className="space-y-6">
                {articles.length > 0 ? (
                  articles.map((article) => (
                    <div
                      key={article.id}
                      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* Métadonnées de l'article */}
                          <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                            {article.category && (
                              <span
                                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${article.category?.color || "bg-gray-100"
                                  } ${article.category?.textColor || "text-gray-600"
                                  }`}
                              >
                                {article.category.name}
                              </span>
                            )}
                            <span className="small-text">
                              {article.readTime}
                            </span>
                            <span className="small-text">
                              {new Date(article.publishedAt).toLocaleDateString(
                                "fr-FR"
                              )}
                            </span>
                          </div>

                          {/* Titre de l'article */}
                          <h3 className="h3-title text-gray-900 mb-3 hover:text-teal-600 transition-colors">
                            <a href={`/articles/${article.slug}`}>
                              {article.title}
                            </a>
                          </h3>

                          {/* Description */}
                          <p className="small-text text-gray-600 mb-4 leading-relaxed line-clamp-3">
                            {article.description}
                          </p>

                          {/* Statistiques de l'article */}
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-1 small-text text-gray-500">
                              <Eye className="w-4 h-4" />
                              <span>{article.views || 0} vues</span>
                            </div>
                            <div className="flex items-center space-x-1 small-text text-gray-500">
                              <Heart className="w-4 h-4" />
                              <span>{article.likes || 0} likes</span>
                            </div>
                            <div className="flex items-center space-x-1 small-text text-gray-500">
                              <MessageCircle className="w-4 h-4" />
                              <span>{article.commentsCount || 0} commentaires</span>
                            </div>
                          </div>

                          {/* Tags si disponibles */}
                          {article.tags && article.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                              {article.tags.slice(0, 5).map((tag, index) => (
                                <span
                                  key={tag.id || `tag-${article.id}-${index}`}
                                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                                >
                                  #{tag.name}
                                </span>
                              ))}
                              {article.tags.length > 5 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                                  +{article.tags.length - 5} autres
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Image d'aperçu de l'article */}
                        <div className="w-24 h-24 rounded-lg ml-6 flex-shrink-0 overflow-hidden">
                          {article.imageUrl ? (
                            <Image
                              src={article.imageUrl}
                              alt={article.title}
                              width={96}
                              height={96}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div
                              className={`w-full h-full ${article.imageColor || "bg-gray-200"
                                } flex items-center justify-center`}
                            >
                              <span className="text-white text-xs font-semibold opacity-50">IMG</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Eye className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="h3-title text-gray-900 mb-2">
                      Aucun article publi&eacute;
                    </h3>
                    <p className="body-text text-gray-500">
                      Cet utilisateur n&apos;a pas encore publié d&apos;articles.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Commentaires */}
            {activeTab === "comments" && (
              <div className="space-y-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
                  </div>
                ) : userComments.length > 0 ? (
                  userComments.map((comment) => (
                    <div
                      key={comment.id}
                      className="bg-white rounded-lg border border-gray-200 p-6"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-medium text-sm">
                            {comment.author?.name?.charAt(0) || "U"}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="h5-title text-gray-900">
                              {comment.author?.name || "Utilisateur"}
                            </span>
                            <span className="small-text text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                          <p className="body-text text-gray-700 mb-3">
                            {comment.content}
                          </p>
                          <div className="text-sm text-gray-600">
                            Sur l&apos;article:{" "}
                            <Link
                              href={`/articles/${comment.article?.slug}`}
                              className="text-teal-600 hover:text-teal-700"
                            >
                              {comment.article?.title || "Article"}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="h3-title text-gray-900 mb-2">
                      Aucun commentaire
                    </h3>
                    <p className="body-text text-gray-500">
                      Cet utilisateur n&apos;a pas encore commenté d&apos;articles.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Likes */}
            {activeTab === "likes" && (
              <div className="space-y-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
                  </div>
                ) : userLikes.length > 0 ? (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="mb-4">
                      <h3 className="h4-title text-gray-900 mb-2">
                        Total des likes donnés: {userLikes.length}
                      </h3>
                    </div>
                    <div className="space-y-4">
                      {userLikes.map((like) => (
                        <div
                          key={like.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <Heart className="w-5 h-5 text-red-500 fill-current" />
                            <div>
                              <Link
                                href={`/articles/${like.article?.slug}`}
                                className="h5-title text-gray-900 hover:text-teal-600"
                              >
                                {like.article?.title || "Article"}
                              </Link>
                              <p className="small-text text-gray-600">
                                Par {like.article?.author?.name || "Auteur"}
                              </p>
                            </div>
                          </div>
                          <span className="small-text text-gray-500">
                            {new Date(like.createdAt).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="h3-title text-gray-900 mb-2">
                      Aucun like
                    </h3>
                    <p className="body-text text-gray-500">
                      Cet utilisateur n&apos;a pas encore liké d&apos;articles.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}