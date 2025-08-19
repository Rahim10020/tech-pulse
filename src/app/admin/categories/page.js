// src/app/admin/categories/page.js - Page de gestion des catégories (admin)
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { useAuth } from "@/context/AuthProvider";
import { useToast } from "@/context/ToastProvider";
import { isAdmin } from "@/lib/auth-roles";
import {
    Plus,
    Edit,
    Trash2,
    Folder,
    Tag,
    Search,
    MoreHorizontal,
    X,
    Save,
    RefreshCw,
    ArrowUpDown,
    Star
} from "lucide-react";

export default function AdminCategoriesPage() {
    const { user, loading } = useAuth();
    const { showToast } = useToast();
    const router = useRouter();

    // États principaux
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        totalArticles: 0,
        mostUsed: null,
    });

    // États de recherche et tri
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");

    // États pour la modal de création/édition
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [modalData, setModalData] = useState({
        name: "",
        description: "",
        icon: "Folder",
        color: "bg-gray-100",
        textColor: "text-gray-800",
    });

    // Couleurs prédéfinies
    const colorOptions = [
        { bg: "bg-gray-100", text: "text-gray-800", name: "Gris" },
        { bg: "bg-blue-100", text: "text-blue-800", name: "Bleu" },
        { bg: "bg-green-100", text: "text-green-800", name: "Vert" },
        { bg: "bg-yellow-100", text: "text-yellow-800", name: "Jaune" },
        { bg: "bg-red-100", text: "text-red-800", name: "Rouge" },
        { bg: "bg-purple-100", text: "text-purple-800", name: "Violet" },
        { bg: "bg-pink-100", text: "text-pink-800", name: "Rose" },
        { bg: "bg-indigo-100", text: "text-indigo-800", name: "Indigo" },
        { bg: "bg-teal-100", text: "text-teal-800", name: "Sarcelle" },
        { bg: "bg-orange-100", text: "text-orange-800", name: "Orange" },
    ];

    // Icônes disponibles
    const iconOptions = [
        "Folder", "Tag", "Code", "Brain", "Shield", "Cloud", "Palette",
        "Zap", "Globe", "Smartphone", "Monitor", "Database", "Server",
        "Lock", "Rocket", "Lightbulb", "Heart", "Star", "Bookmark"
    ];

    // Redirection si non admin
    useEffect(() => {
        if (!loading && (!user || !isAdmin(user))) {
            router.push("/");
        }
    }, [user, loading, router]);

    // Charger les catégories
    const loadCategories = useCallback(async () => {
        try {
            setLoadingCategories(true);
            const params = new URLSearchParams({
                search: searchTerm,
                sortBy,
                sortOrder,
            });

            const response = await fetch(`/api/admin/categories?${params}`, {
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                setCategories(data.categories);
                setStats(data.stats);
            } else {
                showToast("Erreur lors du chargement des catégories", "error");
            }
        } catch (error) {
            console.error("Error loading categories:", error);
            showToast("Erreur lors du chargement des catégories", "error");
        } finally {
            setLoadingCategories(false);
        }
    }, [searchTerm, sortBy, sortOrder, showToast]);

    // Charger les catégories quand les filtres changent
    useEffect(() => {
        if (user && isAdmin(user)) {
            loadCategories();
        }
    }, [user, loadCategories]);

    // Ouvrir la modal de création
    const openCreateModal = () => {
        setEditingCategory(null);
        setModalData({
            name: "",
            description: "",
            icon: "Folder",
            color: "bg-gray-100",
            textColor: "text-gray-800",
        });
        setShowModal(true);
    };

    // Ouvrir la modal d'édition
    const openEditModal = (category) => {
        setEditingCategory(category);
        setModalData({
            name: category.name,
            description: category.description || "",
            icon: category.icon || "Folder",
            color: category.color || "bg-gray-100",
            textColor: category.textColor || "text-gray-800",
        });
        setShowModal(true);
    };

    // Fermer la modal
    const closeModal = () => {
        setShowModal(false);
        setEditingCategory(null);
        setModalData({
            name: "",
            description: "",
            icon: "Folder",
            color: "bg-gray-100",
            textColor: "text-gray-800",
        });
    };

    // Sauvegarder une catégorie
    const handleSaveCategory = async () => {
        try {
            setModalLoading(true);

            // Validation
            if (!modalData.name.trim()) {
                showToast("Le nom de la catégorie est requis", "error");
                return;
            }

            const url = editingCategory
                ? `/api/admin/categories/${editingCategory.id}`
                : "/api/admin/categories";

            const method = editingCategory ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(modalData),
            });

            if (response.ok) {
                showToast(
                    editingCategory ? "Catégorie modifiée avec succès" : "Catégorie créée avec succès",
                    "success"
                );
                closeModal();
                loadCategories();
            } else {
                const data = await response.json();
                showToast(data.error || "Erreur lors de la sauvegarde", "error");
            }
        } catch (error) {
            console.error("Error saving category:", error);
            showToast("Erreur lors de la sauvegarde", "error");
        } finally {
            setModalLoading(false);
        }
    };

    // Supprimer une catégorie
    const handleDeleteCategory = async (category) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${category.name}" ?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/categories/${category.id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (response.ok) {
                showToast("Catégorie supprimée avec succès", "success");
                loadCategories();
            } else {
                const data = await response.json();
                showToast(data.error || "Erreur lors de la suppression", "error");
            }
        } catch (error) {
            console.error("Error deleting category:", error);
            showToast("Erreur lors de la suppression", "error");
        }
    };

    // Rendu de l'icône
    const renderIcon = (iconName, className = "w-5 h-5") => {
        const icons = {
            Folder: <Folder className={className} />,
            Tag: <Tag className={className} />,
            // Ajoutez d'autres icônes selon vos besoins
        };
        return icons[iconName] || <Folder className={className} />;
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
                        <h1 className="h1-title text-gray-900">Gestion des catégories</h1>
                        <p className="body-text text-gray-600">
                            Organisez et gérez les catégories de vos articles
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={loadCategories}
                            disabled={loadingCategories}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <RefreshCw className={`w-4 h-4 ${loadingCategories ? 'animate-spin' : ''}`} />
                            Actualiser
                        </button>
                        <button
                            onClick={openCreateModal}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Nouvelle catégorie
                        </button>
                    </div>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="h6-title text-gray-600">Total catégories</p>
                                <p className="h3-title text-gray-900">{stats.total}</p>
                            </div>
                            <Folder className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>
                    <div className="card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="h6-title text-gray-600">Articles total</p>
                                <p className="h3-title text-gray-900">{stats.totalArticles}</p>
                            </div>
                            <Tag className="w-8 h-8 text-green-500" />
                        </div>
                    </div>
                    <div className="card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="h6-title text-gray-600">Plus utilisée</p>
                                <p className="h5-title text-gray-900">
                                    {stats.mostUsed ? `${stats.mostUsed.name} (${stats.mostUsed.count})` : "Aucune"}
                                </p>
                            </div>
                            <Star className="w-8 h-8 text-yellow-500" />
                        </div>
                    </div>
                </div>

                {/* Filtres et recherche */}
                <div className="card p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Rechercher par nom ou description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-field pl-10"
                            />
                        </div>

                        <select
                            value={`${sortBy}-${sortOrder}`}
                            onChange={(e) => {
                                const [field, order] = e.target.value.split("-");
                                setSortBy(field);
                                setSortOrder(order);
                            }}
                            className="input-field min-w-[160px]"
                        >
                            <option value="name-asc">Nom A-Z</option>
                            <option value="name-desc">Nom Z-A</option>
                            <option value="articles-desc">Plus d'articles</option>
                            <option value="articles-asc">Moins d'articles</option>
                            <option value="createdAt-desc">Plus récentes</option>
                            <option value="createdAt-asc">Plus anciennes</option>
                        </select>
                    </div>
                </div>

                {/* Liste des catégories */}
                <div className="card">
                    {loadingCategories ? (
                        <div className="p-12 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
                            <p className="body-text text-gray-600">Chargement des catégories...</p>
                        </div>
                    ) : categories.length > 0 ? (
                        <div className="divide-y divide-gray-200">
                            {categories.map((category) => (
                                <div key={category.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4 flex-1">
                                            {/* Icône et badge de couleur */}
                                            <div className={`${category.color} ${category.textColor} p-3 rounded-lg`}>
                                                {renderIcon(category.icon)}
                                            </div>

                                            {/* Informations */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="h4-title text-gray-900">{category.name}</h3>
                                                    <span className={`badge ${category.color} ${category.textColor}`}>
                                                        {category.articlesCount} article{category.articlesCount !== 1 ? 's' : ''}
                                                    </span>
                                                </div>

                                                {category.description && (
                                                    <p className="body-text text-gray-600 mb-3 line-clamp-2">
                                                        {category.description}
                                                    </p>
                                                )}

                                                <div className="flex items-center text-sm text-gray-500 space-x-4">
                                                    <span>Slug: {category.slug}</span>
                                                    <span>
                                                        Créée le {new Date(category.createdAt).toLocaleDateString("fr-FR")}
                                                    </span>
                                                    {category.updatedAt !== category.createdAt && (
                                                        <span>
                                                            Modifiée le {new Date(category.updatedAt).toLocaleDateString("fr-FR")}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 ml-4">
                                            <button
                                                onClick={() => openEditModal(category)}
                                                className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100"
                                                title="Modifier"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>

                                            {category.slug !== "non-classe" && (
                                                <button
                                                    onClick={() => handleDeleteCategory(category)}
                                                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="h3-title text-gray-900 mb-2">Aucune catégorie trouvée</h3>
                            <p className="body-text text-gray-600 mb-6">
                                {searchTerm
                                    ? "Aucune catégorie ne correspond à votre recherche."
                                    : "Vous n'avez pas encore créé de catégories."}
                            </p>
                            <button
                                onClick={openCreateModal}
                                className="btn-primary flex items-center gap-2 mx-auto"
                            >
                                <Plus className="w-4 h-4" />
                                Créer votre première catégorie
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de création/édition */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="h2-title text-gray-900">
                                {editingCategory ? "Modifier la catégorie" : "Nouvelle catégorie"}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Corps */}
                        <div className="p-6 space-y-6">
                            {/* Nom */}
                            <div>
                                <label className="h6-title text-gray-700 block mb-2">
                                    Nom de la catégorie *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ex: Développement Web"
                                    value={modalData.name}
                                    onChange={(e) => setModalData(prev => ({ ...prev, name: e.target.value }))}
                                    className="input-field"
                                    maxLength={50}
                                />
                                <p className="small-text text-gray-500 mt-1">
                                    {modalData.name.length}/50 caractères
                                </p>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="h6-title text-gray-700 block mb-2">
                                    Description (optionnel)
                                </label>
                                <textarea
                                    placeholder="Description de la catégorie..."
                                    value={modalData.description}
                                    onChange={(e) => setModalData(prev => ({ ...prev, description: e.target.value }))}
                                    rows="3"
                                    className="input-field"
                                    maxLength={160}
                                />
                                <p className="small-text text-gray-500 mt-1">
                                    {modalData.description.length}/160 caractères
                                </p>
                            </div>

                            {/* Icône */}
                            <div>
                                <label className="h6-title text-gray-700 block mb-2">
                                    Icône
                                </label>
                                <div className="grid grid-cols-5 gap-2">
                                    {iconOptions.map((icon) => (
                                        <button
                                            key={icon}
                                            onClick={() => setModalData(prev => ({ ...prev, icon }))}
                                            className={`p-3 rounded-lg border-2 transition-colors ${modalData.icon === icon
                                                ? "border-teal-500 bg-teal-50"
                                                : "border-gray-200 hover:border-gray-300"
                                                }`}
                                        >
                                            {renderIcon(icon, "w-5 h-5 mx-auto")}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Couleur */}
                            <div>
                                <label className="h6-title text-gray-700 block mb-2">
                                    Couleur
                                </label>
                                <div className="grid grid-cols-5 gap-2">
                                    {colorOptions.map((colorOption) => (
                                        <button
                                            key={colorOption.name}
                                            onClick={() => setModalData(prev => ({
                                                ...prev,
                                                color: colorOption.bg,
                                                textColor: colorOption.text
                                            }))}
                                            className={`p-3 rounded-lg border-2 transition-colors ${colorOption.bg} ${colorOption.text} ${modalData.color === colorOption.bg
                                                ? "border-gray-900"
                                                : "border-gray-200 hover:border-gray-300"
                                                }`}
                                            title={colorOption.name}
                                        >
                                            {renderIcon(modalData.icon, "w-5 h-5 mx-auto")}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Prévisualisation */}
                            <div>
                                <label className="h6-title text-gray-700 block mb-2">
                                    Prévisualisation
                                </label>
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`${modalData.color} ${modalData.textColor} p-2 rounded-lg`}>
                                            {renderIcon(modalData.icon)}
                                        </div>
                                        <div>
                                            <h4 className="h5-title text-gray-900">
                                                {modalData.name || "Nom de la catégorie"}
                                            </h4>
                                            {modalData.description && (
                                                <p className="small-text text-gray-600">
                                                    {modalData.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-200 p-6">
                            <div className="flex items-center justify-end gap-3">
                                <button
                                    onClick={closeModal}
                                    disabled={modalLoading}
                                    className="btn-secondary"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleSaveCategory}
                                    disabled={modalLoading || !modalData.name.trim()}
                                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {modalLoading ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            <span>Sauvegarde...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            <span>{editingCategory ? "Modifier" : "Créer"}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}