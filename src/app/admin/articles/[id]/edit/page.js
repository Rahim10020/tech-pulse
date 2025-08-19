// src/app/admin/articles/[id]/edit/page.js - Page d'édition d'article (admin)
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import { useAuth } from "@/context/AuthProvider";
import { useToast } from "@/context/ToastProvider";
import { isAdmin } from "@/lib/auth-roles";
import TiptapEditor from "@/components/shared/TiptapEditor";
import {
    Save,
    Eye,
    Globe,
    Clock,
    Star,
    ArrowLeft,
    RefreshCw,
    CheckCircle,
    AlertTriangle,
} from "lucide-react";

export default function AdminEditArticlePage() {
    const { user, loading } = useAuth();
    const { showToast } = useToast();
    const router = useRouter();
    const params = useParams();
    const articleId = params?.id;

    // États principaux
    const [article, setArticle] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loadingArticle, setLoadingArticle] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // États du formulaire
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        description: "",
        category: "",
        readTime: "",
        featured: false,
        published: false,
    });

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
                    setCategories(data.filter(cat => cat.slug !== "non-classe"));
                }
            } catch (error) {
                console.error("Error loading categories:", error);
            }
        };
        loadCategories();
    }, []);

    // Charger l'article
    useEffect(() => {
        if (!articleId || !user || !isAdmin(user)) return;

        const loadArticle = async () => {
            try {
                setLoadingArticle(true);
                const response = await fetch(`/api/admin/articles/${articleId}`, {
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();
                    setArticle(data);
                    setFormData({
                        title: data.title || "",
                        content: data.content || "",
                        description: data.description || "",
                        category: data.category?.slug || "",
                        readTime: data.readTime || "",
                        featured: data.featured || false,
                        published: data.published || false,
                    });
                } else if (response.status === 404) {
                    showToast("Article non trouvé", "error");
                    router.push("/admin/articles");
                } else {
                    showToast("Erreur lors du chargement de l'article", "error");
                }
            } catch (error) {
                console.error("Error loading article:", error);
                showToast("Erreur lors du chargement de l'article", "error");
            } finally {
                setLoadingArticle(false);
            }
        };

        loadArticle();
    }, [articleId, user, router, showToast]);

    // Calculer le temps de lecture
    const calculateReadingTime = useCallback((htmlContent) => {
        const textContent = htmlContent.replace(/<[^>]*>/g, "");
        const wordCount = textContent
            .split(/\s+/)
            .filter((word) => word.length > 0).length;
        const readingTimeMinutes = Math.ceil(wordCount / 200);
        return `${readingTimeMinutes} min`;
    }, []);

    // Gérer les changements du formulaire
    const handleFormChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
        setHasChanges(true);

        // Auto-calculer le temps de lecture pour le contenu
        if (field === "content") {
            const newReadTime = calculateReadingTime(value);
            setFormData(prev => ({
                ...prev,
                readTime: newReadTime,
            }));
        }
    };

    // Sauvegarder l'article
    const handleSave = async (publishNow = false) => {
        try {
            setSaving(true);

            // Validation
            if (!formData.title.trim()) {
                showToast("Le titre est requis", "error");
                return;
            }

            if (!formData.content.trim()) {
                showToast("Le contenu est requis", "error");
                return;
            }

            if (publishNow && !formData.category) {
                showToast("Une catégorie est requise pour publier", "error");
                return;
            }

            const updateData = {
                ...formData,
                ...(publishNow && { publishNow: true }),
            };

            const response = await fetch(`/api/admin/articles/${articleId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(updateData),
            });

            if (response.ok) {
                const data = await response.json();
                setArticle(data.article);
                setHasChanges(false);
                showToast(
                    publishNow ? "Article publié avec succès" : "Article sauvegardé avec succès",
                    "success"
                );

                // Rediriger vers la liste si on vient de publier
                if (publishNow) {
                    setTimeout(() => {
                        router.push("/admin/articles");
                    }, 1500);
                }
            } else {
                const data = await response.json();
                showToast(data.error || "Erreur lors de la sauvegarde", "error");
            }
        } catch (error) {
            console.error("Error saving article:", error);
            showToast("Erreur lors de la sauvegarde", "error");
        } finally {
            setSaving(false);
        }
    };

    // Gestionnaire pour l'upload d'images
    const handleImageUpload = useCallback(async (file) => {
        try {
            const formDataUpload = new FormData();
            formDataUpload.append("file", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                credentials: "include",
                body: formDataUpload,
            });

            const data = await response.json();

            if (data.success) {
                return data;
            } else {
                throw new Error(data.error);
            }
        } catch (err) {
            showToast("Erreur lors de l'upload de l'image", "error");
            throw err;
        }
    }, [showToast]);

    // Gérer la fermeture avec changements non sauvegardés
    const handleBack = () => {
        if (hasChanges) {
            const confirmLeave = window.confirm(
                "Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir quitter ?"
            );
            if (!confirmLeave) return;
        }
        router.push("/admin/articles");
    };

    // Déterminer si on peut publier
    const canPublish = formData.title.trim() &&
        formData.content.trim() &&
        formData.category &&
        !saving;

    if (loading || loadingArticle) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                    <p className="body-text text-gray-600">Chargement de l'article...</p>
                </div>
            </div>
        );
    }

    if (!user || !isAdmin(user) || !article) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="container-sm py-4 pt-20">
                {/* Header de la page */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleBack}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Retour
                        </button>
                        <div>
                            <h1 className="h1-title text-gray-900">Modifier l'article</h1>
                            <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-2">
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
                                    {article.featured && (
                                        <span className="badge bg-yellow-100 text-yellow-800 flex items-center gap-1">
                                            <Star className="w-3 h-3" />
                                            Vedette
                                        </span>
                                    )}
                                </div>
                                {hasChanges && (
                                    <span className="small-text text-orange-600 flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" />
                                        Modifications non sauvegardées
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Informations de l'article */}
                    <div className="text-right">
                        <div className="small-text text-gray-600">
                            Temps de lecture:{" "}
                            <span className="font-medium">{formData.readTime}</span>
                        </div>
                        <div className="small-text text-gray-500">
                            {formData.content
                                .replace(/<[^>]*>/g, "")
                                .split(/\s+/)
                                .filter((word) => word.length > 0).length}{" "}
                            mots
                        </div>
                        <div className="small-text text-gray-500">
                            Dernière modification: {new Date(article.updatedAt).toLocaleDateString("fr-FR")}
                        </div>
                    </div>
                </div>

                {/* Formulaire principal */}
                <div className="card">
                    <div className="space-y-6">
                        {/* Titre */}
                        <div className="p-6 pb-0">
                            <input
                                type="text"
                                placeholder="Titre de l'article..."
                                value={formData.title}
                                onChange={(e) => handleFormChange("title", e.target.value)}
                                className="w-full text-3xl bg-transparent font-bold text-gray-900 placeholder-gray-400 border-none outline-none"
                            />
                        </div>

                        {/* Métadonnées */}
                        <div className="px-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="h6-title text-gray-700 block mb-2">
                                    Catégorie
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => handleFormChange("category", e.target.value)}
                                    className="input-field"
                                >
                                    <option value="">Sélectionner une catégorie...</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.slug}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="h6-title text-gray-700 block mb-2">
                                    Description courte
                                </label>
                                <input
                                    type="text"
                                    placeholder="Description pour l'aperçu..."
                                    value={formData.description}
                                    onChange={(e) => handleFormChange("description", e.target.value)}
                                    className="input-field"
                                    maxLength={160}
                                />
                                <p className="small-text text-gray-500 mt-1">
                                    {formData.description.length}/160 caractères
                                </p>
                            </div>
                        </div>

                        {/* Options */}
                        <div className="px-6">
                            <div className="flex flex-wrap gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.featured}
                                        onChange={(e) => handleFormChange("featured", e.target.checked)}
                                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                                    />
                                    <span className="h6-title text-gray-700">Article en vedette</span>
                                </label>
                            </div>
                        </div>

                        {/* Éditeur de contenu */}
                        <div className="px-6">
                            <label className="h6-title text-gray-700 block mb-4">
                                Contenu de l'article
                            </label>
                            <TiptapEditor
                                content={formData.content}
                                onChange={(newContent) => handleFormChange("content", newContent)}
                                placeholder="Rédigez le contenu de votre article..."
                                onImageUpload={handleImageUpload}
                                className="min-h-[500px]"
                            />
                        </div>

                        {/* Actions */}
                        <div className="border-t border-gray-200 p-6">
                            <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
                                <button
                                    onClick={handleBack}
                                    disabled={saving}
                                    className="btn-secondary w-full sm:w-auto"
                                >
                                    Annuler
                                </button>

                                {article.published && (
                                    <button
                                        onClick={() => window.open(`/articles/${article.slug}`, '_blank')}
                                        className="btn-secondary w-full sm:w-auto flex items-center gap-2"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Voir l'article
                                    </button>
                                )}

                                <button
                                    onClick={() => handleSave(false)}
                                    disabled={saving || !formData.title.trim() || !formData.content.trim()}
                                    className="btn-secondary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {saving ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            <span>Sauvegarde...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            <span>Sauvegarder</span>
                                        </>
                                    )}
                                </button>

                                {!article.published && (
                                    <button
                                        onClick={() => handleSave(true)}
                                        disabled={!canPublish}
                                        className="btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        title={!formData.category ? "Sélectionnez une catégorie pour publier" : ""}
                                    >
                                        {saving ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                                <span>Publication...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Globe className="w-4 h-4" />
                                                <span>Publier</span>
                                            </>
                                        )}
                                    </button>
                                )}

                                {article.published && (
                                    <button
                                        onClick={() => handleSave(false)}
                                        disabled={saving}
                                        className="btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {saving ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                                <span>Mise à jour...</span>
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-4 h-4" />
                                                <span>Mettre à jour</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>

                            {/* Messages d'aide */}
                            {!formData.category && formData.title.trim() && formData.content.trim() && (
                                <div className="mt-3 text-center">
                                    <p className="small-text text-orange-600">
                                        💡 Sélectionnez une catégorie pour pouvoir publier l'article
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Informations supplémentaires */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Statistiques de l'article */}
                    <div className="card p-6">
                        <h3 className="h3-title text-gray-900 mb-4">Statistiques</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="body-text text-gray-600">Vues</span>
                                <span className="h6-title text-gray-900">{article.views || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="body-text text-gray-600">Likes</span>
                                <span className="h6-title text-gray-900">{article.likes}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="body-text text-gray-600">Commentaires</span>
                                <span className="h6-title text-gray-900">{article.commentsCount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="body-text text-gray-600">Créé le</span>
                                <span className="h6-title text-gray-900">
                                    {new Date(article.createdAt).toLocaleDateString("fr-FR")}
                                </span>
                            </div>
                            {article.published && (
                                <div className="flex justify-between">
                                    <span className="body-text text-gray-600">Publié le</span>
                                    <span className="h6-title text-gray-900">
                                        {new Date(article.publishedAt).toLocaleDateString("fr-FR")}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Informations SEO */}
                    <div className="card p-6">
                        <h3 className="h3-title text-gray-900 mb-4">SEO</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="small-text text-gray-600">Slug URL</label>
                                <p className="body-text text-gray-900 font-mono bg-gray-50 p-2 rounded">
                                    /articles/{article.slug}
                                </p>
                            </div>
                            <div>
                                <label className="small-text text-gray-600">Longueur du titre</label>
                                <p className="body-text text-gray-900">
                                    {formData.title.length} caractères
                                    {formData.title.length > 60 && (
                                        <span className="text-orange-600 ml-2">(Trop long pour le SEO)</span>
                                    )}
                                </p>
                            </div>
                            <div>
                                <label className="small-text text-gray-600">Longueur de la description</label>
                                <p className="body-text text-gray-900">
                                    {formData.description.length} caractères
                                    {formData.description.length > 160 && (
                                        <span className="text-orange-600 ml-2">(Trop long pour le SEO)</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}