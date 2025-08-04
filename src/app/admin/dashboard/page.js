// src/app/admin/dashboard/page.js - Page d'administration complète
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { useAuth } from "@/context/AuthProvider";
import { useToast } from "@/context/ToastProvider";
import { isAdmin } from "@/lib/auth-roles";
import {
  Users,
  MessageSquare,
  Settings,
  BarChart3,
  Eye,
  EyeOff,
  Trash2,
  Search,
  Filter,
  UserCheck,
  UserX,
  Shield,
  Clock,
  Mail,
  Globe,
  Twitter,
  Linkedin,
  Github,
  AlertTriangle,
  CheckCircle,
  X,
  Plus,
  FileText,
  Heart,
  MessageCircle,
  TrendingUp,
  Activity,
  Calendar,
  Download,
  RefreshCw,
} from "lucide-react";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  // États pour les onglets
  const [activeTab, setActiveTab] = useState("overview");

  // États pour les statistiques
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalArticles: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    unreadMessages: 0,
  });

  // États pour les messages
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // États pour les utilisateurs
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

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

  // Redirection si pas admin
  useEffect(() => {
    if (!loading && (!user || !isAdmin(user))) {
      router.push("/");
    }
  }, [user, loading, router]);

  // Charger les données initiales
  useEffect(() => {
    if (user && isAdmin(user)) {
      loadStats();
      loadSettings();
    }
  }, [user]);

  // Charger les données selon l'onglet actif
  useEffect(() => {
    if (user && isAdmin(user)) {
      if (activeTab === "messages") {
        loadMessages();
      } else if (activeTab === "users") {
        loadUsers();
      }
    }
  }, [activeTab, user, searchTerm, roleFilter]);

  // Charger les statistiques
  const loadStats = async () => {
    try {
      const response = await fetch("/api/admin/stats", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  // Charger les messages
  const loadMessages = async () => {
    setMessagesLoading(true);
    try {
      const response = await fetch("/api/contact", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      showToast("Erreur lors du chargement des messages", "error");
    } finally {
      setMessagesLoading(false);
    }
  };

  // Charger les utilisateurs
  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        role: roleFilter !== "all" ? roleFilter : "",
      });

      const response = await fetch(`/api/admin/users?${params}`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Error loading users:", error);
      showToast("Erreur lors du chargement des utilisateurs", "error");
    } finally {
      setUsersLoading(false);
    }
  };

  // Charger les paramètres
  const loadSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings || settings);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  // Marquer un message comme lu/non lu
  const toggleMessageRead = async (messageId, isRead) => {
    try {
      const response = await fetch(`/api/contact/${messageId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isRead: !isRead }),
      });

      if (response.ok) {
        setMessages(
          messages.map((msg) =>
            msg.id === messageId ? { ...msg, isRead: !isRead } : msg
          )
        );
        // Mettre à jour les stats
        setStats((prev) => ({
          ...prev,
          unreadMessages: isRead
            ? prev.unreadMessages + 1
            : prev.unreadMessages - 1,
        }));
        showToast("Message mis à jour", "success");
      }
    } catch (error) {
      console.error("Error updating message:", error);
      showToast("Erreur lors de la mise à jour", "error");
    }
  };

  // Supprimer un message
  const deleteMessage = async (messageId) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) return;

    try {
      const response = await fetch(`/api/contact/${messageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const deletedMessage = messages.find((m) => m.id === messageId);
        setMessages(messages.filter((msg) => msg.id !== messageId));
        if (deletedMessage && !deletedMessage.isRead) {
          setStats((prev) => ({
            ...prev,
            unreadMessages: prev.unreadMessages - 1,
          }));
        }
        showToast("Message supprimé", "success");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      showToast("Erreur lors de la suppression", "error");
    }
  };

  // Changer le rôle d'un utilisateur
  const changeUserRole = async (userId, newRole) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        setUsers(
          users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        showToast("Rôle utilisateur mis à jour", "success");
      } else {
        const error = await response.json();
        showToast(error.error || "Erreur lors du changement de rôle", "error");
      }
    } catch (error) {
      console.error("Error changing user role:", error);
      showToast("Erreur lors du changement de rôle", "error");
    }
  };

  // Sauvegarder les paramètres
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setSavingSettings(true);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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

  // Gérer les changements des paramètres
  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!user || !isAdmin(user)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header avec titre et actions */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-poppins">
              Administration
            </h1>
            <p className="text-gray-600 font-sans mt-2">
              Gérez votre site et surveillez les performances
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={loadStats}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="font-poppins text-sm">Actualiser</span>
            </button>
          </div>
        </div>

        {/* Onglets */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "overview", label: "Vue d'ensemble", icon: BarChart3 },
              { id: "users", label: "Utilisateurs", icon: Users },
              {
                id: "messages",
                label: "Messages",
                icon: MessageSquare,
                badge: stats.unreadMessages,
              },
              { id: "settings", label: "Paramètres", icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors relative flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? "border-teal-500 text-teal-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="font-poppins">{tab.label}</span>
                {tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu des onglets */}
        <div>
          {/* Vue d'ensemble */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Statistiques principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 font-poppins">
                        Utilisateurs
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.totalUsers}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                </div>
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 font-poppins">
                        Articles
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.totalArticles}
                      </p>
                    </div>
                    <FileText className="w-8 h-8 text-green-500" />
                  </div>
                </div>
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 font-poppins">
                        Vues totales
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.totalViews.toLocaleString()}
                      </p>
                    </div>
                    <Eye className="w-8 h-8 text-purple-500" />
                  </div>
                </div>
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 font-poppins">
                        Messages non lus
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.unreadMessages}
                      </p>
                    </div>
                    <MessageSquare className="w-8 h-8 text-red-500" />
                  </div>
                </div>
              </div>

              {/* Activité récente */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 font-poppins">
                    Activité récente
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 font-sans">
                        Nouvel utilisateur inscrit
                      </span>
                      <span className="text-xs text-gray-400">il y a 2h</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 font-sans">
                        Article publié
                      </span>
                      <span className="text-xs text-gray-400">il y a 4h</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 font-sans">
                        Nouveau message de contact
                      </span>
                      <span className="text-xs text-gray-400">il y a 6h</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 font-poppins">
                    Actions rapides
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setActiveTab("messages")}
                      className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-poppins text-sm">
                        Gérer les messages
                      </span>
                      <MessageSquare className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => setActiveTab("users")}
                      className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-poppins text-sm">
                        Gérer les utilisateurs
                      </span>
                      <Users className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => setActiveTab("settings")}
                      className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-poppins text-sm">
                        Paramètres du site
                      </span>
                      <Settings className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Gestion des utilisateurs */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 font-poppins">
                  Gestion des utilisateurs
                </h2>
              </div>

              {/* Filtres */}
              <div className="flex space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Rechercher par nom, email ou username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 font-sans"
                  />
                </div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 font-sans"
                >
                  <option value="all">Tous les rôles</option>
                  <option value="admin">Administrateurs</option>
                  <option value="reader">Lecteurs</option>
                </select>
              </div>

              {usersLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                </div>
              ) : users.length > 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 font-poppins">
                              {user.name}
                            </h3>
                            <p className="text-sm text-gray-600 font-sans">
                              @{user.username} • {user.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              user.role === "admin"
                                ? "bg-teal-100 text-teal-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {user.role === "admin" ? "Admin" : "Lecteur"}
                          </span>
                          {user.id !== user.id && (
                            <div className="flex space-x-1">
                              {user.role === "reader" ? (
                                <button
                                  onClick={() =>
                                    changeUserRole(user.id, "admin")
                                  }
                                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                                  title="Promouvoir en admin"
                                >
                                  <UserCheck className="w-4 h-4" />
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    changeUserRole(user.id, "reader")
                                  }
                                  className="p-1 text-orange-600 hover:bg-orange-50 rounded"
                                  title="Rétrograder en lecteur"
                                >
                                  <UserX className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-sans">
                    Aucun utilisateur trouvé.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Gestion des messages */}
          {activeTab === "messages" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 font-poppins">
                  Messages de contact
                </h2>
                <span className="text-sm text-gray-500 font-sans">
                  {messages.length} message(s)
                </span>
              </div>

              {messagesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                </div>
              ) : messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`bg-white rounded-lg border p-4 ${
                        !message.isRead
                          ? "border-l-4 border-l-teal-500 bg-teal-50"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-gray-900 font-poppins">
                            {message.subject}
                          </h3>
                          <p className="text-sm text-gray-600 font-sans">
                            De: {message.name} ({message.email})
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              toggleMessageRead(message.id, message.isRead)
                            }
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title={
                              message.isRead
                                ? "Marquer comme non lu"
                                : "Marquer comme lu"
                            }
                          >
                            {message.isRead ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => deleteMessage(message.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2 font-sans">
                        {message.message}
                      </p>
                      <p className="text-xs text-gray-500 font-sans">
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-sans">
                    Aucun message de contact.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Paramètres du site */}
          {activeTab === "settings" && (
            <div className="space-y-8">
              <form onSubmit={handleSettingsSubmit}>
                {/* Informations générales */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center font-poppins">
                    <Globe className="w-5 h-5 mr-2" />
                    Informations générales
                  </h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
                          Nom du site
                        </label>
                        <input
                          type="text"
                          name="siteName"
                          value={settings.siteName}
                          onChange={handleSettingsChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-sans"
                          placeholder="TechPulse"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
                          URL du site
                        </label>
                        <input
                          type="url"
                          name="siteUrl"
                          value={settings.siteUrl}
                          onChange={handleSettingsChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-sans"
                          placeholder="https://techpulse.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
                        Description du site
                      </label>
                      <textarea
                        name="siteDescription"
                        value={settings.siteDescription}
                        onChange={handleSettingsChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none font-sans"
                        placeholder="Description de votre blog..."
                      />
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center font-poppins">
                    <Mail className="w-5 h-5 mr-2" />
                    Informations de contact
                  </h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
                          Email de contact
                        </label>
                        <input
                          type="email"
                          name="contactEmail"
                          value={settings.contactEmail}
                          onChange={handleSettingsChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-sans"
                          placeholder="contact@techpulse.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          name="contactPhone"
                          value={settings.contactPhone}
                          onChange={handleSettingsChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-sans"
                          placeholder="+228 90 89 59 00"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
                        Adresse
                      </label>
                      <textarea
                        name="contactAddress"
                        value={settings.contactAddress}
                        onChange={handleSettingsChange}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none font-sans"
                        placeholder="Tokoin solidarite, Togo"
                      />
                    </div>
                  </div>
                </div>

                {/* Réseaux sociaux */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center font-poppins">
                    <Twitter className="w-5 h-5 mr-2" />
                    Réseaux sociaux
                  </h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
                          Twitter
                        </label>
                        <input
                          type="url"
                          name="socialTwitter"
                          value={settings.socialTwitter}
                          onChange={handleSettingsChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-sans"
                          placeholder="https://twitter.com/techpulse"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
                          LinkedIn
                        </label>
                        <input
                          type="url"
                          name="socialLinkedin"
                          value={settings.socialLinkedin}
                          onChange={handleSettingsChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-sans"
                          placeholder="https://linkedin.com/company/techpulse"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
                          GitHub
                        </label>
                        <input
                          type="url"
                          name="socialGithub"
                          value={settings.socialGithub}
                          onChange={handleSettingsChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-sans"
                          placeholder="https://github.com/techpulse"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* SEO */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center font-poppins">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Paramètres SEO
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
                        Titre SEO
                      </label>
                      <input
                        type="text"
                        name="seoTitle"
                        value={settings.seoTitle}
                        onChange={handleSettingsChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-sans"
                        placeholder="TechPulse - Blog Technologique"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
                        Description SEO
                      </label>
                      <textarea
                        name="seoDescription"
                        value={settings.seoDescription}
                        onChange={handleSettingsChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none font-sans"
                        placeholder="Découvrez les dernières actualités technologiques et les innovations du moment"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
                        Mots-clés SEO
                      </label>
                      <input
                        type="text"
                        name="seoKeywords"
                        value={settings.seoKeywords}
                        onChange={handleSettingsChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-sans"
                        placeholder="tech, technologie, innovation, blog, articles"
                      />
                    </div>
                  </div>
                </div>

                {/* Fonctionnalités */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center font-poppins">
                    <Settings className="w-5 h-5 mr-2" />
                    Fonctionnalités
                  </h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="maintenanceMode"
                          checked={settings.maintenanceMode}
                          onChange={handleSettingsChange}
                          className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                        />
                        <label className="ml-2 text-sm font-medium text-gray-700 font-poppins">
                          Mode maintenance
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="allowComments"
                          checked={settings.allowComments}
                          onChange={handleSettingsChange}
                          className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                        />
                        <label className="ml-2 text-sm font-medium text-gray-700 font-poppins">
                          Autoriser les commentaires
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="allowRegistration"
                          checked={settings.allowRegistration}
                          onChange={handleSettingsChange}
                          className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                        />
                        <label className="ml-2 text-sm font-medium text-gray-700 font-poppins">
                          Autoriser l'inscription
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Code Analytics */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center font-poppins">
                    <Activity className="w-5 h-5 mr-2" />
                    Analytics
                  </h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
                      Code Google Analytics
                    </label>
                    <textarea
                      name="analyticsCode"
                      value={settings.analyticsCode}
                      onChange={handleSettingsChange}
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none font-mono text-sm"
                      placeholder="<!-- Code de tracking Google Analytics -->"
                    />
                    <p className="text-xs text-gray-500 mt-1 font-sans">
                      Collez ici votre code de tracking Google Analytics
                    </p>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      type="submit"
                      disabled={savingSettings}
                      className="flex items-center space-x-2 bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-poppins"
                    >
                      {savingSettings ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Sauvegarde...</span>
                        </>
                      ) : (
                        <>
                          <Settings className="w-4 h-4" />
                          <span>Sauvegarder</span>
                        </>
                      )}
                    </button>
                  </div>

                  {settings.maintenanceMode && (
                    <div className="flex items-center space-x-2 text-orange-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm font-medium font-poppins">
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
    </div>
  );
}
