/**
 * Admin dashboard page component.
 * Provides comprehensive admin interface for managing site content, users, messages, and settings.
 * Includes statistics overview, user management, content moderation, and site configuration.
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ROUTES, getAdminEditArticleRoute } from "@/lib/routes";
import Header from "@/components/layout/Header";
import { useAuth } from "@/context/AuthProvider";
import { useToast } from "@/context/ToastProvider";
import { isAdmin } from "@/lib/auth-roles";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
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
import { LoadingSpinner } from "@/components/ui";

const DEFAULT_SETTINGS = {
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
};

const AUTO_SAVE_CHECKBOX_FIELDS = [
  "maintenanceMode",
  "allowComments",
  "allowRegistration",
];

const MANUAL_SAVE_FIELDS = [
  "siteName",
  "siteDescription",
  "siteUrl",
  "contactEmail",
  "contactPhone",
  "contactAddress",
  "socialTwitter",
  "socialLinkedin",
  "socialGithub",
  "analyticsCode",
  "seoTitle",
  "seoDescription",
  "seoKeywords",
];

export default function AdminDashboard() {
  const { user, loading, markMessagesAsRead, refreshUnreadCount } = useAuth();
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
  const [recentActivities, setRecentActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [savedSettingsSnapshot, setSavedSettingsSnapshot] =
    useState(DEFAULT_SETTINGS);
  const [savingSettings, setSavingSettings] = useState(false);
  const [checkboxSaving, setCheckboxSaving] = useState({
    maintenanceMode: false,
    allowComments: false,
    allowRegistration: false,
  });
  const [showUnsavedSettingsDialog, setShowUnsavedSettingsDialog] =
    useState(false);
  const [pendingTab, setPendingTab] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  const normalizeSettings = useCallback(
    (incomingSettings = {}) => ({
      ...DEFAULT_SETTINGS,
      ...incomingSettings,
    }),
    [],
  );

  const hasUnsavedTextSettings = MANUAL_SAVE_FIELDS.some(
    (field) => (settings[field] ?? "") !== (savedSettingsSnapshot[field] ?? ""),
  );

  // Define all callback and async functions BEFORE useEffect
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
      const articlesResponse = await fetch(
        "/api/admin/articles?limit=5&sortBy=updatedAt&sortOrder=desc",
        {
          credentials: "include",
        },
      );
      if (articlesResponse.ok) {
        const articlesData = await articlesResponse.json();
        setRecentArticles(articlesData.articles);
      }

      // Charger les catégories populaires
      const categoriesResponse = await fetch(
        "/api/admin/categories?sortBy=articles&sortOrder=desc&limit=5",
        {
          credentials: "include",
        },
      );
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setTopCategories(categoriesData.categories);
      }
    } catch (error) {
      console.error("Error loading recent content:", error);
    }
  };

  const loadRecentActivities = useCallback(async () => {
    setActivitiesLoading(true);
    try {
      const response = await fetch("/api/admin/recent-activities", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setRecentActivities(data.activities || []);
      }
    } catch (error) {
      console.error("Error loading recent activities:", error);
    } finally {
      setActivitiesLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async () => {
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
      showToast("Erreur lors du chargement des messages", "error");
    } finally {
      setMessagesLoading(false);
    }
  }, [showToast]);

  const loadUsers = useCallback(async () => {
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
      showToast("Erreur lors du chargement des utilisateurs", "error");
    } finally {
      setUsersLoading(false);
    }
  }, [searchTerm, roleFilter, showToast]);

  const loadSettings = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/settings", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        const normalizedSettings = normalizeSettings(data.settings);
        setSettings(normalizedSettings);
        setSavedSettingsSnapshot(normalizedSettings);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  }, [normalizeSettings]);

  useEffect(() => {
    if (!loading && (!user || !isAdmin(user))) {
      router.push(ROUTES.HOME);
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && isAdmin(user)) {
      loadStats();
      loadSettings();
      loadRecentContent();
      loadRecentActivities();
    }
  }, [user, loadSettings, loadRecentActivities]);

  useEffect(() => {
    if (user && isAdmin(user)) {
      if (activeTab === "messages") {
        loadMessages();
      } else if (activeTab === "users") {
        loadUsers();
      }
    }
  }, [activeTab, user, searchTerm, roleFilter, loadMessages, loadUsers]);

  const toggleMessageRead = async (messageId, isRead) => {
    try {
      const response = await fetch(`/api/contact/${messageId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isRead: !isRead }),
      });
      if (response.ok) {
        setMessages(
          messages.map((msg) =>
            msg.id === messageId ? { ...msg, isRead: !isRead } : msg,
          ),
        );
        // Update the global unread count
        if (!isRead) {
          // If marking as read, decrease count by 1
          markMessagesAsRead(1);
        }
        // Also refresh to ensure sync
        setTimeout(() => refreshUnreadCount(), 1000);
        showToast("Message mis à jour", "success");
      }
    } catch (error) {
      console.error("Error updating message:", error);
      showToast("Erreur lors de la mise à jour", "error");
    }
  };

  const openDeleteDialog = (messageId) => {
    setMessageToDelete(messageId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteMessage = async () => {
    if (!messageToDelete) return;

    const messageId = messageToDelete;
    setShowDeleteDialog(false);
    setMessageToDelete(null);

    try {
      const response = await fetch(`/api/contact/${messageId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const deletedMessage = messages.find((m) => m.id === messageId);
        setMessages(messages.filter((msg) => msg.id !== messageId));
        if (deletedMessage && !deletedMessage.isRead) {
          // Update the global unread count
          markMessagesAsRead(1);
        }
        // Also refresh to ensure sync
        setTimeout(() => refreshUnreadCount(), 1000);
        showToast("Message supprimé avec succès", "success");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      showToast("Erreur lors de la suppression", "error");
    }
  };

  const cancelDeleteMessage = () => {
    setShowDeleteDialog(false);
    setMessageToDelete(null);
  };

  const changeUserRole = async (userId, newRole) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (response.ok) {
        setUsers(
          users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
        );
        showToast("Rôle utilisateur mis à jour", "success");
      } else {
        showToast(
          (await response.json()).error ||
            "Erreur lors du changement du rôle utilisateur",
          "error",
        );
      }
    } catch (error) {
      console.error("Error changing user role:", error);
      showToast("Error changing user role", "error");
    }
  };

  const saveSettings = useCallback(
    async (settingsToSave) => {
      setSavingSettings(true);
      try {
        const response = await fetch("/api/admin/settings", {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(settingsToSave),
        });
        if (response.ok) {
          const payload = await response.json();
          const normalizedSettings = normalizeSettings(
            payload.settings || settingsToSave,
          );
          setSettings(normalizedSettings);
          setSavedSettingsSnapshot(normalizedSettings);
          showToast("Paramètres sauvegardés avec succès", "success");
          return true;
        } else {
          showToast(
            (await response.json()).error || "Erreur lors de la sauvegarde",
            "error",
          );
          return false;
        }
      } catch (error) {
        console.error("Error saving settings:", error);
        showToast("Error while saving", "error");
        return false;
      } finally {
        setSavingSettings(false);
      }
    },
    [normalizeSettings, showToast],
  );

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    await saveSettings(settings);
  };

  const autoSaveCheckboxSetting = useCallback(
    async (name, nextValue, previousValue) => {
      setCheckboxSaving((prev) => ({ ...prev, [name]: true }));

      try {
        const response = await fetch("/api/admin/settings", {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ [name]: nextValue }),
        });

        if (!response.ok) {
          const errorPayload = await response.json().catch(() => ({}));
          throw new Error(errorPayload.error || "Auto-save checkbox failed");
        }

        const payload = await response.json();
        const normalizedSettings = normalizeSettings(
          payload.settings || { ...savedSettingsSnapshot, [name]: nextValue },
        );

        setSettings((prev) => ({ ...prev, [name]: normalizedSettings[name] }));
        setSavedSettingsSnapshot(normalizedSettings);
      } catch (error) {
        console.error(`Error auto-saving ${name}:`, error);
        setSettings((prev) => ({ ...prev, [name]: previousValue }));
        showToast(
          "Erreur lors de la sauvegarde automatique du paramètre",
          "error",
        );
      } finally {
        setCheckboxSaving((prev) => ({ ...prev, [name]: false }));
      }
    },
    [normalizeSettings, savedSettingsSnapshot, showToast],
  );

  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && AUTO_SAVE_CHECKBOX_FIELDS.includes(name)) {
      const previousValue = settings[name];
      const nextValue = checked;

      setSettings((prev) => ({
        ...prev,
        [name]: nextValue,
      }));

      autoSaveCheckboxSetting(name, nextValue, previousValue);
      return;
    }

    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const discardUnsavedTextSettings = useCallback(() => {
    setSettings((prev) => {
      const revertedSettings = { ...prev };
      MANUAL_SAVE_FIELDS.forEach((field) => {
        revertedSettings[field] = savedSettingsSnapshot[field] ?? "";
      });
      return revertedSettings;
    });
  }, [savedSettingsSnapshot]);

  const handleTabChange = useCallback(
    (nextTab) => {
      if (nextTab === activeTab) return;

      if (activeTab === "settings" && hasUnsavedTextSettings) {
        setPendingTab(nextTab);
        setShowUnsavedSettingsDialog(true);
        return;
      }

      setActiveTab(nextTab);
    },
    [activeTab, hasUnsavedTextSettings],
  );

  const handleStayOnSettings = () => {
    setPendingTab(null);
    setShowUnsavedSettingsDialog(false);
  };

  const handleDiscardAndLeaveSettings = () => {
    discardUnsavedTextSettings();
    if (pendingTab) {
      setActiveTab(pendingTab);
    }
    setPendingTab(null);
    setShowUnsavedSettingsDialog(false);
  };

  const handleSaveAndLeaveSettings = async () => {
    const isSaved = await saveSettings(settings);
    if (!isSaved) return;

    if (pendingTab) {
      setActiveTab(pendingTab);
    }
    setPendingTab(null);
    setShowUnsavedSettingsDialog(false);
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (activeTab === "settings" && hasUnsavedTextSettings) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [activeTab, hasUnsavedTextSettings]);

  const formatTimeAgoFr = (date) => {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins}m`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return new Date(date).toLocaleDateString("fr-FR");
  };

  const getActivityIcon = (type) => {
    const iconClass = "w-4 h-4";
    switch (type) {
      case "user_signup":
        return <Users className={`${iconClass} text-green-500`} />;
      case "article_published":
        return <FileText className={`${iconClass} text-blue-500`} />;
      case "message_received":
        return <MessageSquare className={`${iconClass} text-orange-500`} />;
      default:
        return <Activity className={`${iconClass} text-gray-500`} />;
    }
  };

  if (loading) {
    return <LoadingSpinner />;
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
                onClick={() => handleTabChange(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors relative flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
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
                      <p className="h3-title text-gray-900">
                        {stats.totalUsers}
                      </p>
                    </div>
                    <Users className="w-4 h-4 text-green-500" />
                  </div>
                </div>
                <div className="card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="h6-title text-gray-600">Articles</p>
                      <p className="h3-title text-gray-900">
                        {stats.totalArticles}
                      </p>
                    </div>
                    <FileText className="w-4 h-4 text-green-500" />
                  </div>
                </div>
                <div className="card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="h6-title text-gray-600">Vues totales</p>
                      <p className="h3-title text-gray-900">
                        {stats.totalViews?.toLocaleString() || 0}
                      </p>
                    </div>
                    <Eye className="w-4 h-4 text-green-500" />
                  </div>
                </div>
                <div className="card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="h6-title text-gray-600">Messages non lus</p>
                      <p className="h3-title text-gray-900">
                        {stats.unreadMessages}
                      </p>
                    </div>
                    <MessageSquare className="w-4 h-4 text-green-500" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card p-6">
                  <h3 className="h3-title text-gray-900 mb-4">
                    Activités récentes
                  </h3>
                  <div className="space-y-3">
                    {activitiesLoading ? (
                      <div className="text-center mt-24">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600 mx-auto"></div>
                      </div>
                    ) : recentActivities.length > 0 ? (
                      recentActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center gap-3"
                        >
                          <div className="flex items-center justify-center">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="small-text text-gray-600">
                              {activity.description}
                            </span>
                            <p className="text-xs text-gray-500 truncate">
                              {activity.details}
                            </p>
                          </div>
                          <span className="small-text text-gray-400 whitespace-nowrap">
                            {formatTimeAgoFr(activity.timestamp)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <p className="small-text text-gray-500">
                          Aucune activité récente
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="h3-title text-gray-900 mb-4">
                    Actions rapides
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => router.push(ROUTES.ADMIN_ARTICLES)}
                      className="w-full flex items-center justify-between p-3 text-left card hover:bg-gray-50 transition-colors"
                    >
                      <span className="body-text">Gérer les articles</span>
                      <FileText className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => router.push(ROUTES.ADMIN_CATEGORIES)}
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
                  onClick={() => router.push(ROUTES.CREATE)}
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
                      <p className="h3-title text-gray-900">
                        {stats.publishedArticles || 0}
                      </p>
                    </div>
                    <Globe className="w-4 h-4 text-green-500" />
                  </div>
                </div>
                <div className="card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="h6-title text-gray-600">Brouillons</p>
                      <p className="h3-title text-gray-900">
                        {stats.draftArticles || 0}
                      </p>
                    </div>
                    <Clock className="w-4 h-4 text-green-500" />
                  </div>
                </div>
                <div className="card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="h6-title text-gray-600">Catégories</p>
                      <p className="h3-title text-gray-900">
                        {stats.totalCategories || 0}
                      </p>
                    </div>
                    <Tag className="w-4 h-4 text-green-500" />
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
                      onClick={() => router.push(ROUTES.ADMIN_ARTICLES)}
                      className="btn-secondary text-sm flex items-center gap-1"
                    >
                      Voir tout
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {recentArticles.length > 0 ? (
                    <div className="space-y-3">
                      {recentArticles.slice(0, 5).map((article) => (
                        <div
                          key={article.id}
                          className="flex items-center justify-between p-3 bg-gray-50"
                        >
                          <div className="flex-1">
                            <h4 className="h6-title text-gray-900 line-clamp-1">
                              {article.title}
                            </h4>
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
                                {new Date(article.updatedAt).toLocaleDateString(
                                  "fr-FR",
                                )}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              router.push(getAdminEditArticleRoute(article.id))
                            }
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-32">
                      <div className="flex flex-col items-center gap-4">
                        <FileText className="w-12 h-12 text-gray-300" />
                        <p className="body-text text-gray-500">
                          Aucun article récent
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Catégories populaires */}
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="h3-title text-gray-900">
                      Catégories populaires
                    </h3>
                    <button
                      onClick={() => router.push(ROUTES.ADMIN_CATEGORIES)}
                      className="btn-secondary text-sm flex items-center gap-1"
                    >
                      Gérer
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {topCategories.length > 0 ? (
                    <div className="space-y-3">
                      {topCategories.slice(0, 5).map((category) => (
                        <div
                          key={category.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`${category.color} ${category.textColor} p-2 rounded-lg`}
                            >
                              <Folder className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="h6-title text-gray-900">
                                {category.name}
                              </h4>
                              <p className="small-text text-gray-500">
                                {category.articlesCount} article
                                {category.articlesCount !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`badge ${category.color} ${category.textColor}`}
                          >
                            {category.articlesCount}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="body-text text-gray-500">
                        Aucune catégorie
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Gestion des utilisateurs */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <h2 className="h2-title text-gray-900">
                Gestion des utilisateurs
              </h2>
              {/* Code existant pour la gestion des utilisateurs */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <input
                  type="text"
                  placeholder="Rechercher par nom, email ou username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field"
                />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="input-field cursor-pointer max-w-xs"
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
                <div className="card divide-y divide-gray-200">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="h5-title text-gray-900">
                            {user.username}
                          </h3>
                          <p className="small-text text-gray-600">
                            @{user.username} • {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`badge ${
                            user.role === "admin"
                              ? "bg-teal-100 text-teal-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
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
              ) : (
                <div className="mt-32">
                  <div className="flex flex-col gap-2">
                    <Users className="w-12 h-12 text-gray-300" />
                    <p className="body-text text-gray-500">
                      Aucun utilisateur trouvé.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "messages" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="h2-title text-gray-900">Messages de contact</h2>
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
                      className={`card p-4 ${
                        !message.isRead
                          ? "border-l-4 border-l-teal-500 bg-teal-50"
                          : ""
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="h5-title text-gray-900">
                            {message.subject}
                          </h3>
                          <p className="small-text text-gray-600">
                            De: {message.name} ({message.email})
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              toggleMessageRead(message.id, message.isRead)
                            }
                            className={`p-1 ${message.isRead ? "text-gray-300 cursor-not-allowed" : "text-gray-400 hover:text-gray-600"}`}
                            disabled={message.isRead}
                            title={
                              message.isRead
                                ? "Message déjà lu"
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
                            onClick={() => openDeleteDialog(message.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="body-text text-gray-700 mb-2">
                        {message.message}
                      </p>
                      <p className="small-text text-gray-500">
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 card">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="body-text text-gray-500">
                    Aucun message de contact.
                  </p>
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
                    Informations générales
                  </h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="h6-title block mb-2">
                          Nom du site
                        </label>
                        <input
                          type="text"
                          name="siteName"
                          value={settings.siteName || ""}
                          onChange={handleSettingsChange}
                          className="input-field"
                          placeholder="pixelpulse"
                        />
                      </div>
                      <div>
                        <label className="h6-title block mb-2">
                          URL du site
                        </label>
                        <input
                          type="url"
                          name="siteUrl"
                          value={settings.siteUrl || ""}
                          onChange={handleSettingsChange}
                          className="input-field"
                          placeholder="https://pixelpulse.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="h6-title block mb-2">
                        Description du site
                      </label>
                      <textarea
                        name="siteDescription"
                        value={settings.siteDescription || ""}
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
                    Informations de contact
                  </h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="h6-title block mb-2">
                          Email de contact
                        </label>
                        <input
                          type="email"
                          name="contactEmail"
                          value={settings.contactEmail || ""}
                          onChange={handleSettingsChange}
                          className="input-field"
                          placeholder="contact@pixelpulse.com"
                        />
                      </div>
                      <div>
                        <label className="h6-title block mb-2">Téléphone</label>
                        <input
                          type="tel"
                          name="contactPhone"
                          value={settings.contactPhone || ""}
                          onChange={handleSettingsChange}
                          className="input-field"
                          placeholder="+228 90 89 59 00"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="h6-title block mb-2">Adresse</label>
                      <textarea
                        name="contactAddress"
                        value={settings.contactAddress || ""}
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
                    Réseaux sociaux
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="h6-title block mb-2">Twitter</label>
                      <input
                        type="url"
                        name="socialTwitter"
                        value={settings.socialTwitter || ""}
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
                        value={settings.socialLinkedin || ""}
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
                        value={settings.socialGithub || ""}
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
                    Paramètres SEO
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="h6-title block mb-2">Titre SEO</label>
                      <input
                        type="text"
                        name="seoTitle"
                        value={settings.seoTitle || ""}
                        onChange={handleSettingsChange}
                        className="input-field"
                        placeholder="pixelpulse - Blog Technologique"
                      />
                    </div>
                    <div>
                      <label className="h6-title block mb-2">
                        Description SEO
                      </label>
                      <textarea
                        name="seoDescription"
                        value={settings.seoDescription || ""}
                        onChange={handleSettingsChange}
                        rows="3"
                        className="input-field"
                        placeholder="Découvrez les dernières actualités technologiques..."
                      />
                    </div>
                    <div>
                      <label className="h6-title block mb-2">
                        Mots-clés SEO
                      </label>
                      <input
                        type="text"
                        name="seoKeywords"
                        value={settings.seoKeywords || ""}
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
                    Fonctionnalités
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="maintenanceMode"
                        checked={settings.maintenanceMode}
                        onChange={handleSettingsChange}
                        disabled={checkboxSaving.maintenanceMode}
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                      <label className="h6-title ml-2">Mode maintenance</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="allowComments"
                        checked={settings.allowComments}
                        onChange={handleSettingsChange}
                        disabled={checkboxSaving.allowComments}
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                      <label className="h6-title ml-2">
                        Autoriser les commentaires
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="allowRegistration"
                        checked={settings.allowRegistration}
                        onChange={handleSettingsChange}
                        disabled={checkboxSaving.allowRegistration}
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                      <label className="h6-title ml-2">
                        Autoriser l&apos;inscription
                      </label>
                    </div>
                  </div>
                </div>

                {/* Analytics */}
                <div className="card p-6 mb-6">
                  <h2 className="h2-title text-gray-900 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Analyses
                  </h2>
                  <div>
                    <label className="h6-title block mb-2">
                      Code Google Analytics
                    </label>
                    <textarea
                      name="analyticsCode"
                      value={settings.analyticsCode || ""}
                      onChange={handleSettingsChange}
                      rows="4"
                      className="input-field font-mono text-sm"
                      placeholder="<!-- Code de tracking Google Analytics -->"
                    />
                    <p className="small-text text-gray-500 mt-1">
                      Collez votre code de suivi Google Analytics ici
                    </p>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    disabled={savingSettings || !hasUnsavedTextSettings}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
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

                  {hasUnsavedTextSettings && (
                    <span className="small-text text-orange-600">
                      Modifications non sauvegardées
                    </span>
                  )}

                  {settings.maintenanceMode && (
                    <div className="flex items-center gap-2 text-orange-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="h6-title">Mode maintenance activé</span>
                    </div>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Dialogue de confirmation de suppression */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Supprimer le message"
        message="Êtes-vous sûr de vouloir supprimer ce message de contact ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
        onConfirm={confirmDeleteMessage}
        onCancel={cancelDeleteMessage}
      />

      {showUnsavedSettingsDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 p-4 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Modifications non sauvegardées
              </h3>
              <p className="body-text text-gray-600 mt-2">
                Vous avez modifié des paramètres texte sans sauvegarder.
                Voulez-vous sauvegarder avant de quitter cet onglet ?
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-b-lg flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={handleStayOnSettings}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Rester
              </button>
              <button
                onClick={handleDiscardAndLeaveSettings}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Quitter sans sauvegarder
              </button>
              <button
                onClick={handleSaveAndLeaveSettings}
                disabled={savingSettings}
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors"
              >
                {savingSettings ? "Sauvegarde..." : "Sauvegarder et quitter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
