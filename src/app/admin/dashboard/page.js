// src/app/admin/dashboard/page.js - Dashboard admin avec navigation améliorée
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
  UserCheck,
  UserX,
  Mail,
  Globe,
  Twitter,
  Linkedin,
  Github,
  AlertTriangle,
  CheckCircle,
  Plus,
  FileText,
  Activity,
  RefreshCw,
  Tag,
  Folder,
  Edit,
  Star,
  Clock,
  Calendar,
  ArrowRight,
} from "lucide-react";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  // États existants...
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalArticles: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    unreadMessages: 0,
    publishedArticles: 0,
    draftArticles: 0,
    featuredArticles: 0,
    totalCategories: 0,
  });

  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [recentArticles, setRecentArticles] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [settings, setSettings] = useState({
    siteName: "pixelpulse",
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
    if (!loading && (!user || !isAdmin(user))) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && isAdmin(user)) {
      loadStats();
      loadSettings();
      loadRecentContent();
    }
  }, [user]);

  useEffect(() => {
    if (user && isAdmin(user)) {
      if (activeTab === "messages") {
        loadMessages();
      } else if (activeTab === "users") {
        loadUsers();
      }
    }
  }, [activeTab, user, searchTerm, roleFilter]);

  const loadStats = async () => {
    try {
      const response = await fetch("/api/admin/stats", {
        credentials: "include",
      });
      if (response.ok) {
        setStats(await response.json());
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const loadRecentContent = async () => {
    try {
      // Charger les articles récents
      const articlesResponse = await fetch("/api/admin/articles?limit=5&sortBy=updatedAt&sortOrder=desc", {
        credentials: "include",
      });
      if (articlesResponse.ok) {
        const articlesData = await articlesResponse.json();
        setRecentArticles(articlesData.articles);
      }

      // Charger les catégories populaires
      const categoriesResponse = await fetch("/api/admin/categories?sortBy=articles&sortOrder=desc&limit=5", {
        credentials: "include",
      });
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setTopCategories(categoriesData.categories);
      }
    } catch (error) {
      console.error("Error loading recent content:", error);
    }
  };

  const loadMessages = async () => {
    setMessagesLoading(true);
    try {
      const response = await fetch("/api/contact", {
        credentials: "include",
      });
      if (response.ok) {
        setMessages((await response.json()).messages || []);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      showToast("Error loading messages", "error");
    } finally {
      setMessagesLoading(false);
    }
  };

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
        setUsers((await response.json()).users || []);
      }
    } catch (error) {
      console.error("Error loading users:", error);
      showToast("Error loading users", "error");
    } finally {
      setUsersLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        setSettings((await response.json()).settings || settings);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

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
        setMessages(messages.map(msg =>
          msg.id === messageId ? { ...msg, isRead: !isRead } : msg
        ));
        setStats(prev => ({
          ...prev,
          unreadMessages: isRead ? prev.unreadMessages + 1 : prev.unreadMessages - 1,
        }));
        showToast("Message mis à jour", "success");
      }
    } catch (error) {
      console.error("Error updating message:", error);
      showToast("Erreur lors de la mise à jour", "error");
    }
  };

  const deleteMessage = async (messageId) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const response = await fetch(`/api/contact/${messageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const deletedMessage = messages.find(m => m.id === messageId);
        setMessages(messages.filter(msg => msg.id !== messageId));
        if (deletedMessage && !deletedMessage.isRead) {
          setStats(prev => ({
            ...prev,
            unreadMessages: prev.unreadMessages - 1,
          }));
        }
        showToast("Message deleted", "success");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      showToast("Erreur lors de la suppression", "error");
    }
  };

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
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        showToast("User role updated", "success");
      } else {
        showToast((await response.json()).error || "Error changing user role", "error");
      }
    } catch (error) {
      console.error("Error changing user role:", error);
      showToast("Error changing user role", "error");
    }
  };

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
        showToast((await response.json()).error || "Error while saving", "error");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      showToast("Error while saving", "error");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
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

  if (!user || !isAdmin(user)) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="h1-title text-gray-900">Administration</h1>
            <p className="body-text text-gray-600">
              Gérez votre site et surveillez les performances
            </p>
          </div>
          <button
            onClick={loadStats}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Actualiser</span>
          </button>
        </div>

        {/* Onglets */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex gap-8 overflow-x-auto">
            {[
              { id: "overview", label: "Vue d'ensemble", icon: BarChart3 },
              { id: "content", label: "Contenu", icon: FileText },
              { id: "users", label: "Utilisateurs", icon: Users },
              { id: "messages", label: "Messages", icon: MessageSquare, badge: stats.unreadMessages },
              { id: "settings", label: "Paramètres", icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors relative flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="h6-title text-gray-600">Utilisateurs</p>
                      <p className="h3-title text-gray-900">{stats.totalUsers}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                </div>
                <div className="card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="h6-title text-gray-600">Articles</p>
                      <p className="h3-title text-gray-900">{stats.totalArticles}</p>
                    </div>
                    <FileText className="w-8 h-8 text-green-500" />
                  </div>
                </div>
                <div className="card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="h6-title text-gray-600">Vues totales</p>
                      <p className="h3-title text-gray-900">{stats.totalViews?.toLocaleString() || 0}</p>
                    </div>
                    <Eye className="w-8 h-8 text-purple-500" />
                  </div>
                </div>
                <div className="card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="h6-title text-gray-600">Messages non lus</p>
                      <p className="h3-title text-gray-900">{stats.unreadMessages}</p>
                    </div>
                    <MessageSquare className="w-8 h-8 text-red-500" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card p-6">
                  <h3 className="h3-title text-gray-900 mb-4">Activités récentes</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="small-text text-gray-600">
                        Nouvel utilisateur inscrit
                      </span>
                      <span className="small-text text-gray-400">Il y a 2 heures</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="small-text text-gray-600">
                        Article publié
                      </span>
                      <span className="small-text text-gray-400">Il y a 4 heures</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="small-text text-gray-600">
                        Nouveau message de contact
                      </span>
                      <span className="small-text text-gray-400">Il y a 10 heures</span>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="h3-title text-gray-900 mb-4">Actions rapides</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => router.push("/admin/articles")}
                      className="w-full flex items-center justify-between p-3 text-left card hover:bg-gray-50 transition-colors"
                    >
                      <span className="body-text">Gérer les articles</span>
                      <FileText className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => router.push("/admin/categories")}
                      className="w-full flex items-center justify-between p-3 text-left card hover:bg-gray-50 transition-colors"
                    >
                      <span className="body-text">Gérer les catégories</span>
                      <Tag className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => setActiveTab("users")}
                      className="w-full flex items-center justify-between p-3 text-left card hover:bg-gray-50 transition-colors"
                    >
                      <span className="body-text">Gérer les utilisateurs</span>
                      <Users className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => setActiveTab("messages")}
                      className="w-full flex items-center justify-between p-3 text-left card hover:bg-gray-50 transition-colors"
                    >
                      <span className="body-text">Voir les messages</span>
                      <MessageSquare className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Gestion du contenu */}
          {activeTab === "content" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="h2-title text-gray-900">Gestion du contenu</h2>
                <button
                  onClick={() => router.push("/create")}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nouvel article
                </button>
              </div>

              {/* Statistiques du contenu */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="h6-title text-gray-600">Articles publiés</p>
                      <p className="h3-title text-gray-900">{stats.publishedArticles || 0}</p>
                    </div>
                    <Globe className="w-8 h-8 text-green-500" />
                  </div>
                </div>
                <div className="card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="h6-title text-gray-600">Brouillons</p>
                      <p className="h3-title text-gray-900">{stats.draftArticles || 0}</p>
                    </div>
                    <Clock className="w-8 h-8 text-orange-500" />
                  </div>
                </div>
                <div className="card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="h6-title text-gray-600">Catégories</p>
                      <p className="h3-title text-gray-900">{stats.totalCategories || 0}</p>
                    </div>
                    <Tag className="w-8 h-8 text-purple-500" />
                  </div>
                </div>
              </div>

              {/* Gestion rapide */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Articles récents */}
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="h3-title text-gray-900">Articles récents</h3>
                    <button
                      onClick={() => router.push("/admin/articles")}
                      className="btn-secondary text-sm flex items-center gap-1"
                    >
                      Voir tout
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {recentArticles.length > 0 ? (
                    <div className="space-y-3">
                      {recentArticles.slice(0, 5).map((article) => (
                        <div key={article.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="h6-title text-gray-900 line-clamp-1">{article.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              {article.published ? (
                                <span className="badge bg-green-100 text-green-800 flex items-center gap-1">
                                  <Globe className="w-3 h-3" />
                                  Publié
                                </span>
                              ) : (
                                <span className="badge bg-gray-100 text-gray-800 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Brouillon
                                </span>
                              )}
                              <span className="small-text text-gray-500">
                                {new Date(article.updatedAt).toLocaleDateString("fr-FR")}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => router.push(`/admin/articles/${article.id}/edit`)}
                            className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-white"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="body-text text-gray-500">Aucun article récent</p>
                    </div>
                  )}
                </div>

                {/* Catégories populaires */}
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="h3-title text-gray-900">Catégories populaires</h3>
                    <button
                      onClick={() => router.push("/admin/categories")}
                      className="btn-secondary text-sm flex items-center gap-1"
                    >
                      Gérer
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {topCategories.length > 0 ? (
                    <div className="space-y-3">
                      {topCategories.slice(0, 5).map((category) => (
                        <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`${category.color} ${category.textColor} p-2 rounded-lg`}>
                              <Folder className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="h6-title text-gray-900">{category.name}</h4>
                              <p className="small-text text-gray-500">
                                {category.articlesCount} article{category.articlesCount !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <span className={`badge ${category.color} ${category.textColor}`}>
                            {category.articlesCount}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="body-text text-gray-500">Aucune catégorie</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Gestion des utilisateurs */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <h2 className="h2-title text-gray-900">Gestion des utilisateurs</h2>
              {/* Code existant pour la gestion des utilisateurs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Rechercher par nom, email ou username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field flex-1"
                />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="input-field"
                >
                  <option value="all">All roles</option>
                  <option value="admin">Administrators</option>
                  <option value="reader">Readers</option>
                </select>
              </div>

              {usersLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                </div>
              ) : users.length > 0 ? (
                <div className="card divide-y divide-gray-200">
                  {users.map((user) => (
                    <div key={user.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="h5-title text-gray-900">{user.name}</h3>
                          <p className="small-text text-gray-600">
                            @{user.username} • {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`badge ${user.role === "admin" ? "bg-teal-100 text-teal-800" : "bg-gray-100 text-gray-800"
                          }`}>
                          {user.role === "admin" ? "Admin" : "Lecteur"}
                        </span>
                        {user.id !== user.id && (
                          <div className="flex gap-1">
                            {user.role === "reader" ? (
                              <button
                                onClick={() => changeUserRole(user.id, "admin")}
                                className="p-1 text-green-600 hover:bg-green-50 rounded"
                                title="Promouvoir en admin"
                              >
                                <UserCheck className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => changeUserRole(user.id, "reader")}
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
              ) : (
                <div className="text-center py-12 card">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="body-text text-gray-500">No users found.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "messages" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="h2-title text-gray-900">Contact Messages</h2>
                <span className="small-text text-gray-500">
                  {messages.length} message(s)
                </span>
              </div>
              {/* Code existant pour la gestion des messages */}
              {messagesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                </div>
              ) : messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`card p-4 ${!message.isRead ? "border-l-4 border-l-teal-500 bg-teal-50" : ""
                        }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="h5-title text-gray-900">{message.subject}</h3>
                          <p className="small-text text-gray-600">
                            De: {message.name} ({message.email})
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleMessageRead(message.id, message.isRead)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title={message.isRead ? "Marquer comme non lu" : "Marquer comme lu"}
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
                      <p className="body-text text-gray-700 mb-2">{message.message}</p>
                      <p className="small-text text-gray-500">
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 card">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="body-text text-gray-500">No contact message.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-8">
              <h2 className="h2-title text-gray-900">Paramètres du site</h2>
              {/* Code existant pour les paramètres */}
              <form onSubmit={handleSettingsSubmit}>
                {/* Informations générales */}
                <div className="card p-6 mb-6">
                  <h2 className="h2-title text-gray-900 mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    General information
                  </h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="h6-title block mb-2">Site name</label>
                        <input
                          type="text"
                          name="siteName"
                          value={settings.siteName}
                          onChange={handleSettingsChange}
                          className="input-field"
                          placeholder="pixelpulse"
                        />
                      </div>
                      <div>
                        <label className="h6-title block mb-2">Site URL</label>
                        <input
                          type="url"
                          name="siteUrl"
                          value={settings.siteUrl}
                          onChange={handleSettingsChange}
                          className="input-field"
                          placeholder="https://pixelpulse.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="h6-title block mb-2">Site description</label>
                      <textarea
                        name="siteDescription"
                        value={settings.siteDescription}
                        onChange={handleSettingsChange}
                        rows="3"
                        className="input-field"
                        placeholder="Description de votre blog..."
                      />
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="card p-6 mb-6">
                  <h2 className="h2-title text-gray-900 mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Contact informations
                  </h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="h6-title block mb-2">Contact Email</label>
                        <input
                          type="email"
                          name="contactEmail"
                          value={settings.contactEmail}
                          onChange={handleSettingsChange}
                          className="input-field"
                          placeholder="contact@pixelpulse.com"
                        />
                      </div>
                      <div>
                        <label className="h6-title block mb-2">Phone</label>
                        <input
                          type="tel"
                          name="contactPhone"
                          value={settings.contactPhone}
                          onChange={handleSettingsChange}
                          className="input-field"
                          placeholder="+228 90 89 59 00"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="h6-title block mb-2">Address</label>
                      <textarea
                        name="contactAddress"
                        value={settings.contactAddress}
                        onChange={handleSettingsChange}
                        rows="2"
                        className="input-field"
                        placeholder="Tokoin solidarite, Togo"
                      />
                    </div>
                  </div>
                </div>

                {/* Réseaux sociaux */}
                <div className="card p-6 mb-6">
                  <h2 className="h2-title text-gray-900 mb-4 flex items-center gap-2">
                    <Twitter className="w-5 h-5" />
                    Social networks
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="h6-title block mb-2">Twitter</label>
                      <input
                        type="url"
                        name="socialTwitter"
                        value={settings.socialTwitter}
                        onChange={handleSettingsChange}
                        className="input-field"
                        placeholder="https://twitter.com/pixelpulse"
                      />
                    </div>
                    <div>
                      <label className="h6-title block mb-2">LinkedIn</label>
                      <input
                        type="url"
                        name="socialLinkedin"
                        value={settings.socialLinkedin}
                        onChange={handleSettingsChange}
                        className="input-field"
                        placeholder="https://linkedin.com/company/pixelpulse"
                      />
                    </div>
                    <div>
                      <label className="h6-title block mb-2">GitHub</label>
                      <input
                        type="url"
                        name="socialGithub"
                        value={settings.socialGithub}
                        onChange={handleSettingsChange}
                        className="input-field"
                        placeholder="https://github.com/pixelpulse"
                      />
                    </div>
                  </div>
                </div>

                {/* SEO */}
                <div className="card p-6 mb-6">
                  <h2 className="h2-title text-gray-900 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    SEO Settings
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="h6-title block mb-2">SEO title</label>
                      <input
                        type="text"
                        name="seoTitle"
                        value={settings.seoTitle}
                        onChange={handleSettingsChange}
                        className="input-field"
                        placeholder="pixelpulse - Blog Technologique"
                      />
                    </div>
                    <div>
                      <label className="h6-title block mb-2">SEO description</label>
                      <textarea
                        name="seoDescription"
                        value={settings.seoDescription}
                        onChange={handleSettingsChange}
                        rows="3"
                        className="input-field"
                        placeholder="Découvrez les dernières actualités technologiques..."
                      />
                    </div>
                    <div>
                      <label className="h6-title block mb-2">SEO Keywords</label>
                      <input
                        type="text"
                        name="seoKeywords"
                        value={settings.seoKeywords}
                        onChange={handleSettingsChange}
                        className="input-field"
                        placeholder="tech, technology, innovation, blog, articles"
                      />
                    </div>
                  </div>
                </div>

                {/* Fonctionnalités */}
                <div className="card p-6 mb-6">
                  <h2 className="h2-title text-gray-900 mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Features
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="maintenanceMode"
                        checked={settings.maintenanceMode}
                        onChange={handleSettingsChange}
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                      <label className="h6-title ml-2">Maintenance mode</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="allowComments"
                        checked={settings.allowComments}
                        onChange={handleSettingsChange}
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                      <label className="h6-title ml-2">Allow comments</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="allowRegistration"
                        checked={settings.allowRegistration}
                        onChange={handleSettingsChange}
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                      <label className="h6-title ml-2">Allow registration</label>
                    </div>
                  </div>
                </div>

                {/* Analytics */}
                <div className="card p-6 mb-6">
                  <h2 className="h2-title text-gray-900 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Analytics
                  </h2>
                  <div>
                    <label className="h6-title block mb-2">Code Google Analytics</label>
                    <textarea
                      name="analyticsCode"
                      value={settings.analyticsCode}
                      onChange={handleSettingsChange}
                      rows="4"
                      className="input-field font-mono text-sm"
                      placeholder="<!-- Code de tracking Google Analytics -->"
                    />
                    <p className="small-text text-gray-500 mt-1">
                      Paste your Google Analytics tracking code here
                    </p>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                  >
                    {savingSettings ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Settings className="w-4 h-4" />
                        <span>Save</span>
                      </>
                    )}
                  </button>

                  {settings.maintenanceMode && (
                    <div className="flex items-center gap-2 text-orange-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="h6-title">Maintenance Mode activated</span>
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