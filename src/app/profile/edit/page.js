// app/profile/edit/page.js - Page d'édition de profil avec fonctionnalités admin
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import ProfileForm from "@/components/forms/ProfileForm";
import { useAuth } from "@/context/AuthProvider";
import { useToast } from "@/context/ToastProvider";
import { isAdmin, isPublisher, isReader } from "@/lib/auth-roles";
import {
  Bell,
  MessageSquare,
  Users,
  FileText,
  Eye,
  Heart,
  MessageCircle,
  Settings,
  ExternalLink,
  CheckCircle,
  Clock,
  Globe,
  Mail,
  Twitter,
  Linkedin,
  Github,
  Code,
  AlertTriangle,
} from "lucide-react";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // États pour les fonctionnalités admin
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalArticles: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
  });

  const [unreadMessages, setUnreadMessages] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);

  // États pour les paramètres du site
  const [settings, setSettings] = useState({
    siteName: "TechPulse",
    siteDescription: "",
    siteUrl: "",
    contactEmail: "",
    contactPhone: "",
    contactAddress: "",
    socialTwitter: "",
    socialLinkedin: "",
    socialGithub: "",
    analyticsCode: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    maintenanceMode: false,
    allowComments: true,
    allowRegistration: true,
  });
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  // Charger les données admin si l'utilisateur est admin
  useEffect(() => {
    if (user && isAdmin(user)) {
      fetchAdminData();
      fetchSettings();
    }
  }, [user]);

  // Rediriger les lecteurs vers la page d'accueil
  useEffect(() => {
    if (user && isReader(user)) {
      router.push("/");
    }
  }, [user, router]);

  const fetchAdminData = async () => {
    try {
      setLoadingStats(true);
      const token = localStorage.getItem("token");

      // Récupérer les statistiques
      const statsResponse = await fetch("/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Récupérer les messages non lus
      const messagesResponse = await fetch("/api/contact?unread=true&limit=5", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json();
        setUnreadMessages(messagesData.contacts || []);
      }

      // Récupérer les messages récents
      const recentResponse = await fetch("/api/contact?limit=5", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (recentResponse.ok) {
        const recentData = await recentResponse.json();
        setRecentMessages(recentData.contacts || []);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
      showToast("Erreur lors du chargement des données", "error");
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/settings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings || settings);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      showToast("Erreur lors du chargement des paramètres", "error");
    }
  };

  const markMessageAsRead = async (messageId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/contact/${messageId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isRead: true }),
      });

      if (response.ok) {
        showToast("Message marqué comme lu", "success");
        fetchAdminData(); // Recharger les données
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
      showToast("Erreur lors de la mise à jour", "error");
    }
  };

  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setSavingSettings(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        showToast("Paramètres sauvegardés avec succès", "success");
      } else {
        const error = await response.json();
        showToast(error.error || "Erreur lors de la sauvegarde", "error");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      showToast("Erreur lors de la sauvegarde", "error");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleUpdateProfile = async (formData) => {
    setIsLoading(true);

    try {
      const result = await updateProfile(formData);

      if (result.success) {
        showToast("Profil mis à jour avec succès !", "success");
        router.push(`/profile/${user.id}`);
      } else {
        showToast(result.error || "Erreur lors de la mise à jour", "error");
      }
    } catch (error) {
      showToast("Une erreur est survenue", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container-sm py-4">
        <h1 className="text-2xl font-poppins font-bold text-gray-900 mb-8">
          {isAdmin(user)
            ? "Administration"
            : isPublisher(user)
            ? "Mon Profil"
            : "Édition du profil"}
        </h1>

        {/* Onglets pour les admins */}
        {isAdmin(user) && (
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "profile"
                      ? "border-teal-500 text-teal-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Mon Profil
                </button>
                <button
                  onClick={() => setActiveTab("messages")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "messages"
                      ? "border-teal-500 text-teal-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Messages ({unreadMessages.length})
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "settings"
                      ? "border-teal-500 text-teal-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Paramètres du site
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Onglets pour les publishers */}
        {isPublisher(user) && (
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "profile"
                      ? "border-teal-500 text-teal-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Mon Profil
                </button>
                <button
                  onClick={() => setActiveTab("articles")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "articles"
                      ? "border-teal-500 text-teal-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Mes Articles
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Contenu des onglets */}
        {activeTab === "profile" && (
          <div>
            <ProfileForm
              initialData={user}
              onSubmit={handleUpdateProfile}
              isLoading={isLoading}
            />
          </div>
        )}

        {isPublisher(user) && activeTab === "articles" && (
          <div className="card">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Mes Articles
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-500 text-center py-8">
                Gestion de vos articles en cours de développement...
              </p>
            </div>
          </div>
        )}

        {isAdmin(user) && activeTab === "messages" && (
          <div className="space-y-8">
            {/* Messages non lus */}
            <div className="card">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-md font-poppins font-bold text-gray-900 flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-red-500" />
                  Messages non lus ({unreadMessages.length})
                </h2>
              </div>
              <div className="p-6">
                {unreadMessages.length === 0 ? (
                  <p className="text-gray-500 font-poppins text-xs text-center py-4">
                    Aucun message non lu
                  </p>
                ) : (
                  <div className="space-y-4">
                    {unreadMessages.map((message) => (
                      <div
                        key={message.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-sm font-medium text-gray-900">
                                {message.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(
                                  message.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              {message.subject}
                            </p>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {message.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {message.email}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => markMessageAsRead(message.id)}
                              className="p-1 text-green-600 hover:text-green-700"
                              title="Marquer comme lu"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <a
                              href={`mailto:${message.email}`}
                              className="p-1 text-blue-600 hover:text-blue-700"
                              title="Répondre"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Messages récents */}
            <div className="card">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-md font-poppins font-bold text-gray-900 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-blue-500" />
                  Messages récents
                </h2>
              </div>
              <div className="p-6">
                {recentMessages.length === 0 ? (
                  <p className="text-gray-500 text-xs font-poppins text-center py-4">
                    Aucun message récent
                  </p>
                ) : (
                  <div className="space-y-4">
                    {recentMessages.map((message) => (
                      <div
                        key={message.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-sm font-medium text-gray-900">
                                {message.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(
                                  message.createdAt
                                ).toLocaleDateString()}
                              </span>
                              {!message.isRead && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Non lu
                                </span>
                              )}
                            </div>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              {message.subject}
                            </p>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {message.message}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {!message.isRead && (
                              <button
                                onClick={() => markMessageAsRead(message.id)}
                                className="p-1 text-green-600 hover:text-green-700"
                                title="Marquer comme lu"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            <a
                              href={`mailto:${message.email}`}
                              className="p-1 text-blue-600 hover:text-blue-700"
                              title="Répondre"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {isAdmin(user) && activeTab === "messages" && (
          <div className="card">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-md font-poppins font-bold text-gray-900 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Tous les messages de contact
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-500 text-xs font-poppins text-center py-8">
                Page de gestion des messages en cours de développement...
              </p>
            </div>
          </div>
        )}

        {isAdmin(user) && activeTab === "settings" && (
          <div className="space-y-8">
            <form onSubmit={handleSettingsSubmit}>
              {/* Informations générales */}
              <div className="card">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-poppins font-bold text-gray-900 flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    Informations générales
                  </h2>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="label font-poppins">Nom du site</label>
                      <input
                        type="text"
                        name="siteName"
                        value={settings.siteName}
                        onChange={handleSettingsChange}
                        className="input-field font-poppins"
                        placeholder="TechPulse"
                      />
                    </div>
                    <div>
                      <label className="label font-poppins">URL du site</label>
                      <input
                        type="url"
                        name="siteUrl"
                        value={settings.siteUrl}
                        onChange={handleSettingsChange}
                        className="input-field font-poppins"
                        placeholder="https://techpulse.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label font-poppins">
                      Description du site
                    </label>
                    <textarea
                      name="siteDescription"
                      value={settings.siteDescription}
                      onChange={handleSettingsChange}
                      rows="3"
                      className="input-field resize-none font-poppins"
                      placeholder="Description de votre blog..."
                    />
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="card">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-poppins font-bold text-gray-900 flex items-center">
                    <Mail className="w-5 h-5 mr-2" />
                    Informations de contact
                  </h2>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="label font-poppins">
                        Email de contact
                      </label>
                      <input
                        type="email"
                        name="contactEmail"
                        value={settings.contactEmail}
                        onChange={handleSettingsChange}
                        className="input-field font-poppins"
                        placeholder="contact@techpulse.com"
                      />
                    </div>
                    <div>
                      <label className="label font-poppins">Téléphone</label>
                      <input
                        type="tel"
                        name="contactPhone"
                        value={settings.contactPhone}
                        onChange={handleSettingsChange}
                        className="input-field font-poppins"
                        placeholder="+228 90 89 59 00"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label font-poppins">Adresse</label>
                    <textarea
                      name="contactAddress"
                      value={settings.contactAddress}
                      onChange={handleSettingsChange}
                      rows="2"
                      className="input-field resize-none font-poppins"
                      placeholder="Tokoin solidarite, Togo"
                    />
                  </div>
                </div>
              </div>

              {/* Réseaux sociaux */}
              <div className="card">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold font-poppins text-gray-900 flex items-center">
                    <Twitter className="w-5 h-5 mr-2" />
                    Réseaux sociaux
                  </h2>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="label font-poppins">Twitter</label>
                      <input
                        type="url"
                        name="socialTwitter"
                        value={settings.socialTwitter}
                        onChange={handleSettingsChange}
                        className="input-field font-poppins"
                        placeholder="https://twitter.com/techpulse"
                      />
                    </div>
                    <div>
                      <label className="label font-poppins">LinkedIn</label>
                      <input
                        type="url"
                        name="socialLinkedin"
                        value={settings.socialLinkedin}
                        onChange={handleSettingsChange}
                        className="input-field font-poppins"
                        placeholder="https://linkedin.com/company/techpulse"
                      />
                    </div>
                    <div>
                      <label className="label font-poppins">GitHub</label>
                      <input
                        type="url"
                        name="socialGithub"
                        value={settings.socialGithub}
                        onChange={handleSettingsChange}
                        className="input-field font-poppins"
                        placeholder="https://github.com/techpulse"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Fonctionnalités */}
              <div className="card mb-5">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold font-poppins text-gray-900 flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Fonctionnalités
                  </h2>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="maintenanceMode"
                        checked={settings.maintenanceMode}
                        onChange={handleSettingsChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm font-poppins font-medium text-gray-700">
                        Mode maintenance
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="allowComments"
                        checked={settings.allowComments}
                        onChange={handleSettingsChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm font-poppins font-medium text-gray-700">
                        Autoriser les commentaires
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="allowRegistration"
                        checked={settings.allowRegistration}
                        onChange={handleSettingsChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm font-poppins font-medium text-gray-700">
                        Autoriser l'inscription
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="btn-primary font-poppins flex items-center"
                  >
                    {savingSettings ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sauvegarde...
                      </>
                    ) : (
                      <>
                        <Settings className="w-4 h-4 mr-2" />
                        Sauvegarder
                      </>
                    )}
                  </button>
                </div>

                {settings.maintenanceMode && (
                  <div className="flex items-center space-x-2 text-orange-600">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-poppins font-medium">
                      Mode maintenance activé
                    </span>
                  </div>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
