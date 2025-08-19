// src/app/admin/articles/page.js - Page de gestion des articles (admin)
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { useAuth } from "@/context/AuthProvider";
import { useToast } from "@/context/ToastProvider";
import { isAdmin } from "@/lib/auth-roles";
import {
    Search,
    Plus,
    Filter,
    Eye,
    Edit,
    Trash2,
    FileText,
    Calendar,
    User,
    Heart,
    MessageSquare,
    Star,
    MoreHorizontal,
    CheckCircle,
    Clock,
    Globe,
    RefreshCw,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

export default function AdminArticlesPage() {
    const { user, loading } = useAuth();
    const { showToast } = useToast();
    const router = useRouter();

    // États principaux
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading_articles, setLoadingArticles] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        published: 0,
        drafts: 0,
        featured: 0,
    });

    // États de filtrage et recherche
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [sortBy, setSortBy] = useState("updatedAt");
    const [sortOrder, setSortOrder] = useState("desc");

    // États de pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage] = useState(20);

    // États UI
    const [selectedArticles, setSelectedArticles] = useState(new Set());
    const [showFilters, setShowFilters] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);

    // Redirection si non admin
    useEffect(() => {
        if (!loading && (!user || !isAdmin(user))) {
            router.push("/");
        }
    }, [user, loading, router]);

    // Charger les catégories
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await fetch("/api/categories?type=all");
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data);
                }
            } catch (error) {
                console.error("Error loading categories:", error);
            }
        };
        loadCategories();
    }, []);

    // Charger les articles
    const loadArticles = useCallback(async () => {
        try {
            setLoadingArticles(true);
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: itemsPerPage.toString(),
                search: searchTerm,
                status: statusFilter,
                category: categoryFilter,
                sortBy,
                sortOrder,
            });

            const response = await fetch(`/api/admin/articles?${params}`, {
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                setArticles(data.articles);
                setStats(data.stats);
                setTotalPages(data.pagination.pages);
            } else {
                showToast("Erreur lors du chargement des articles", "error");
            }
        } catch (error) {
            console.error("Error loading articles:", error);
            showToast("Erreur lors du chargement des articles", "error");
        } finally {
            setLoadingArticles(false);
        }
    }, [currentPage, itemsPerPage, searchTerm, statusFilter, categoryFilter, sortBy, sortOrder, showToast]);

    // Charger les articles quand les filtres changent
    useEffect(() => {
        if (user && isAdmin(user)) {
            loadArticles();
        }
    }, [user, loadArticles]);

    // Réinitialiser la pagination quand les filtres changent
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, categoryFilter, sortBy, sortOrder]);

    // Actions sur les articles
    const toggleArticleStatus = async (articleId, currentStatus) => {
        try {
            setActionLoading(articleId);
            const response = await fetch(`/api/admin/articles/${articleId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ published: !currentStatus }),
            });

            if (response.ok) {
                showToast(
                    currentStatus ? "Article mis en brouillon" : "Article publié",
                    "success"
                );
                loadArticles();
            } else {
                const data = await response.json();
                showToast(data.error || "Erreur lors de la modification", "error");
            }
        } catch (error) {
            console.error("Error toggling article status:", error);
            showToast("Erreur lors de la modification", "error");
        } finally {
            setActionLoading(null);
        }
    };

    const toggleFeatured = async (articleId, currentFeatured) => {
        try {
            setActionLoading(articleId);
            const response = await fetch(`/api/admin/articles/${articleId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ featured: !currentFeatured }),
            });

            if (response.ok) {
                showToast(
                    currentFeatured ? "Article retiré des vedettes" : "Article mis en vedette",
                    "success"
                );
                loadArticles();
            } else {
                showToast("Erreur lors de la modification", "error");
            }
        } catch (error) {
            console.error("Error toggling featured:", error);
            showToast("Erreur lors de la modification", "error");
        } finally {
            setActionLoading(null);
        }
    };

    const deleteArticle = async (articleId, articleTitle) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer "${articleTitle}" ?`)) {
            return;
        }

        try {
            setActionLoading(articleId);
            const response = await fetch(`/api/admin/articles/${articleId}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (response.ok) {
                showToast("Article supprimé avec succès", "success");
                loadArticles();
            } else {
                showToast("Erreur lors de la suppression", "error");
            }
        } catch (error) {
            console.error("Error deleting article:", error);
            showToast("Erreur lors de la suppression", "error");
        } finally {
            setActionLoading(null);
        }
    };

    // Gestion de la sélection multiple
    const toggleSelectAll = () => {
        if (selectedArticles.size === articles.length) {
            setSelectedArticles(new Set());
        } else {
            setSelectedArticles(new Set(articles.map(a => a.id)));
        }
    };

    const toggleSelectArticle = (articleId) => {
        const newSelected = new Set(selectedArticles);
        if (newSelected.has(articleId)) {
            newSelected.delete(articleId);
        } else {
            newSelected.add(articleId);
        }
        setSelectedArticles(newSelected);
    };

    // Formatage des données
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const getStatusBadge = (article) => {
        if (article.featured && article.published) {
            return (
                <span className="badge bg-yellow-100 text-yellow-800 flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Vedette
                </span>
            );
        } else if (article.published) {
            return (
                <span className="badge bg-green-100 text-green-800 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Publié
                </span>
            );
        } else {
            return (
                <span className="badge bg-gray-100 text-gray-800 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Brouillon
                </span>
            );
        }
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
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
                    <div>
                        <h1 className="h1-title text-gray-900">Gestion des articles</h1>
                        <p className="body-text text-gray-600">
                            Gérez tous vos articles, brouillons et contenus publiés
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={loadArticles}
                            disabled={loading_articles}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading_articles ? 'animate-spin' : ''}`} />
                            Actualiser
                        </button>
                        <button
                            onClick={() => router.push("/create")}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Nouvel article
                        </button>
                    </div>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="h6-title text-gray-600">Total</p>
                                <p className="h3-title text-gray-900">{stats.total}</p>
                            </div>
                            <FileText className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>
                    <div className="card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="h6-title text-gray-600">Publiés</p>
                                <p className="h3-title text-gray-900">{stats.published}</p>
                            </div>
                            <Globe className="w-8 h-8 text-green-500" />
                        </div>
                    </div>
                    <div className="card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="h6-title text-gray-600">Brouillons</p>
                                <p className="h3-title text-gray-900">{stats.drafts}</p>
                            </div>
                            <Clock className="w-8 h-8 text-orange-500" />
                        </div>
                    </div>
                    <div className="card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="h6-title text-gray-600">En vedette</p>
                                <p className="h3-title text-gray-900">{stats.featured}</p>
                            </div>
                            <Star className="w-8 h-8 text-yellow-500" />
                        </div>
                    </div>
                </div>

                {/* Filtres et recherche */}
                <div className="card p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Recherche */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Rechercher par titre, contenu..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-field pl-10"
                            />
                        </div>

                        {/* Filtres */}
                        <div className="flex flex-wrap gap-3">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="input-field min-w-[140px]"
                            >
                                <option value="all">Tous les statuts</option>
                                <option value="published">Publiés</option>
                                <option value="draft">Brouillons</option>
                                <option value="featured">En vedette</option>
                            </select>

                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="input-field min-w-[140px]"
                            >
                                <option value="">Toutes catégories</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.slug}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={`${sortBy}-${sortOrder}`}
                                onChange={(e) => {
                                    const [field, order] = e.target.value.split("-");
                                    setSortBy(field);
                                    setSortOrder(order);
                                }}
                                className="input-field min-w-[140px]"
                            >
                                <option value="updatedAt-desc">Modifié récemment</option>
                                <option value="updatedAt-asc">Modifié anciennement</option>
                                <option value="publishedAt-desc">Publié récemment</option>
                                <option value="publishedAt-asc">Publié anciennement</option>
                                <option value="title-asc">Titre A-Z</option>
                                <option value="title-desc">Titre Z-A</option>
                                <option value="views-desc">Plus vus</option>
                                <option value="views-asc">Moins vus</option>
                            </select>
                        </div>
                    </div>

                    {/* Actions de masse */}
                    {selectedArticles.size > 0 && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                            <p className="small-text text-gray-600">
                                {selectedArticles.size} article(s) sélectionné(s)
                            </p>
                            <div className="flex gap-2">
                                <button className="btn-secondary text-sm">
                                    Publier la sélection
                                </button>
                                <button className="btn-secondary text-sm">
                                    Mettre en brouillon
                                </button>
                                <button className="btn-secondary text-sm text-red-600">
                                    Supprimer la sélection
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Liste des articles */}
                <div className="card">
                    {loading_articles ? (
                        <div className="p-12 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
                            <p className="body-text text-gray-600">Chargement des articles...</p>
                        </div>
                    ) : articles.length > 0 ? (
                        <>
                            {/* Header du tableau */}
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedArticles.size === articles.length && articles.length > 0}
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                                    />
                                    <span className="ml-4 h6-title text-gray-900">Article</span>
                                </div>
                            </div>

                            {/* Corps du tableau */}
                            <div className="divide-y divide-gray-200">
                                {articles.map((article) => (
                                    <div key={article.id} className="p-6 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start space-x-4">
                                            {/* Checkbox */}
                                            <input
                                                type="checkbox"
                                                checked={selectedArticles.has(article.id)}
                                                onChange={() => toggleSelectArticle(article.id)}
                                                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 mt-1"
                                            />

                                            {/* Contenu principal */}
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="h4-title text-gray-900 line-clamp-1">
                                                                {article.title}
                                                            </h3>
                                                            {getStatusBadge(article)}
                                                        </div>

                                                        {article.description && (
                                                            <p className="body-text text-gray-600 line-clamp-2 mb-3">
                                                                {article.description}
                                                            </p>
                                                        )}

                                                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                                                            <span className="flex items-center gap-1">
                                                                <User className="w-4 h-4" />
                                                                {article.author.name}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="w-4 h-4" />
                                                                {formatDate(article.updatedAt)}
                                                            </span>
                                                            {article.category && (
                                                                <span className={`badge ${article.category.color} ${article.category.textColor}`}>
                                                                    {article.category.name}
                                                                </span>
                                                            )}
                                                            <span className="flex items-center gap-1">
                                                                <Eye className="w-4 h-4" />
                                                                {article.views || 0}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Heart className="w-4 h-4" />
                                                                {article.likes}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <MessageSquare className="w-4 h-4" />
                                                                {article.commentsCount}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-2 ml-4">
                                                        {article.published && (
                                                            <button
                                                                onClick={() => window.open(`/articles/${article.slug}`, '_blank')}
                                                                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                                                                title="Voir l'article"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                        )}

                                                        <button
                                                            onClick={() => router.push(`/admin/articles/${article.id}/edit`)}
                                                            className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100"
                                                            title="Modifier"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>

                                                        <button
                                                            onClick={() => toggleFeatured(article.id, article.featured)}
                                                            disabled={actionLoading === article.id}
                                                            className={`p-2 rounded-lg hover:bg-gray-100 ${article.featured
                                                                ? "text-yellow-500 hover:text-yellow-600"
                                                                : "text-gray-400 hover:text-yellow-500"
                                                                }`}
                                                            title={article.featured ? "Retirer de la vedette" : "Mettre en vedette"}
                                                        >
                                                            <Star className="w-4 h-4" />
                                                        </button>

                                                        <button
                                                            onClick={() => toggleArticleStatus(article.id, article.published)}
                                                            disabled={actionLoading === article.id}
                                                            className={`p-2 rounded-lg hover:bg-gray-100 ${article.published
                                                                ? "text-orange-500 hover:text-orange-600"
                                                                : "text-green-500 hover:text-green-600"
                                                                }`}
                                                            title={article.published ? "Mettre en brouillon" : "Publier"}
                                                        >
                                                            {article.published ? <Clock className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                                        </button>

                                                        <button
                                                            onClick={() => deleteArticle(article.id, article.title)}
                                                            disabled={actionLoading === article.id}
                                                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                                                            title="Supprimer"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="p-6 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <p className="small-text text-gray-600">
                                            Page {currentPage} sur {totalPages}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                disabled={currentPage === 1}
                                                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                                Précédent
                                            </button>
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                                disabled={currentPage === totalPages}
                                                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                            >
                                                Suivant
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="p-12 text-center">
                            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="h3-title text-gray-900 mb-2">Aucun article trouvé</h3>
                            <p className="body-text text-gray-600 mb-6">
                                {searchTerm || statusFilter !== "all" || categoryFilter
                                    ? "Aucun article ne correspond à vos critères de recherche."
                                    : "Vous n'avez pas encore créé d'articles."}
                            </p>
                            <button
                                onClick={() => router.push("/create")}
                                className="btn-primary flex items-center gap-2 mx-auto"
                            >
                                <Plus className="w-4 h-4" />
                                Créer votre premier article
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}