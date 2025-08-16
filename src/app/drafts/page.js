// app/drafts/page.js - page des brouillons (terminé)
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { useToast } from "@/context/ToastProvider";
import Header from "@/components/layout/Header";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import DraftCard from "@/components/drafts/DraftCard";
import DraftFilters from "@/components/drafts/DraftFilters";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  Eye,
  Trash2,
  Send,
} from "lucide-react";

export default function DraftsPage() {
  const { user, loading } = useAuth();
  const { success, error } = useToast();
  const router = useRouter();

  const [drafts, setDrafts] = useState([]);
  const [filteredDrafts, setFilteredDrafts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("updated"); // 'updated', 'created', 'title'
  const [selectedDrafts, setSelectedDrafts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);

  // Rediriger si non connecté
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Charger les brouillons et catégories
  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      setIsLoading(true);
      try {
        // Charger les brouillons
        const draftsResponse = await fetch("/api/drafts", {
          credentials: "include",
        });
        const draftsData = await draftsResponse.json();

        if (draftsData.success) {
          setDrafts(draftsData.drafts);
        } else {
          error("Erreur lors du chargement des brouillons");
        }

        // Charger les catégories
        const categoriesResponse = await fetch("/api/categories?type=all");
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData || []);
      } catch (err) {
        console.error("Error fetching drafts:", err);
        error("Erreur lors du chargement des données");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [user, error]);

  // Filtrer et trier les brouillons
  useEffect(() => {
    let filtered = [...drafts];

    // Filtrer par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (draft) =>
          draft.title.toLowerCase().includes(query) ||
          draft.content.toLowerCase().includes(query) ||
          draft.category?.name.toLowerCase().includes(query)
      );
    }

    // Filtrer par catégorie
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (draft) => draft.category?.slug === selectedCategory
      );
    }

    // Trier
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "created":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "updated":
        default:
          return new Date(b.updatedAt) - new Date(a.updatedAt);
      }
    });

    setFilteredDrafts(filtered);
  }, [drafts, searchQuery, selectedCategory, sortBy]);

  // Publier un brouillon
  const handlePublishDraft = async (draftId) => {
    try {
      const response = await fetch(`/api/drafts/${draftId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ action: "publish" }),
      });

      const data = await response.json();

      if (data.success) {
        success("Brouillon publié avec succès !");
        // Supprimer le brouillon de la liste
        setDrafts((prev) => prev.filter((d) => d.id !== draftId));
        setSelectedDrafts((prev) => prev.filter((id) => id !== draftId));

        // Rediriger vers l'article publié
        router.push(`/articles/${data.article.slug}`);
      } else {
        error(data.error || "Erreur lors de la publication");
      }
    } catch (err) {
      console.error("Error publishing draft:", err);
      error("Erreur lors de la publication");
    }
  };

  // Supprimer un brouillon
  const handleDeleteDraft = async (draftId) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce brouillon ?")) {
      return;
    }

    try {
      const response = await fetch(`/api/drafts/${draftId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        success("Brouillon supprimé avec succès");
        setDrafts((prev) => prev.filter((d) => d.id !== draftId));
        setSelectedDrafts((prev) => prev.filter((id) => id !== draftId));
      } else {
        error("Erreur lors de la suppression");
      }
    } catch (err) {
      console.error("Error deleting draft:", err);
      error("Erreur lors de la suppression");
    }
  };

  // Actions en lot
  const handleBulkAction = async (action) => {
    if (selectedDrafts.length === 0) {
      error("Aucun brouillon sélectionné");
      return;
    }

    if (action === "delete") {
      if (
        !confirm(
          `Êtes-vous sûr de vouloir supprimer ${selectedDrafts.length} brouillon(s) ?`
        )
      ) {
        return;
      }

      try {
        await Promise.all(
          selectedDrafts.map((id) =>
            fetch(`/api/drafts/${id}`, {
              method: "DELETE",
              credentials: "include",
            })
          )
        );

        success(`${selectedDrafts.length} brouillon(s) supprimé(s)`);
        setDrafts((prev) => prev.filter((d) => !selectedDrafts.includes(d.id)));
        setSelectedDrafts([]);
      } catch (err) {
        error("Erreur lors de la suppression en lot");
      }
    }
  };

  // Toggle sélection d'un brouillon
  const toggleDraftSelection = (draftId) => {
    setSelectedDrafts((prev) =>
      prev.includes(draftId)
        ? prev.filter((id) => id !== draftId)
        : [...prev, draftId]
    );
  };

  // Sélectionner tous/aucun
  const toggleSelectAll = () => {
    if (selectedDrafts.length === filteredDrafts.length) {
      setSelectedDrafts([]);
    } else {
      setSelectedDrafts(filteredDrafts.map((d) => d.id));
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="h1-title text-gray-900 mb-2">
              Mes brouillons
            </h1>
            <p className="body-text text-gray-600">
              {drafts.length} brouillon{drafts.length !== 1 ? "s" : ""} •
              {filteredDrafts.length} affiché
              {filteredDrafts.length !== 1 ? "s" : ""}
            </p>
          </div>

          <button
            onClick={() => router.push("/create")}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau brouillon</span>
          </button>
        </div>

        {/* Filtres et recherche */}
        <div className="card p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher dans vos brouillons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field w-full pl-10"
              />
            </div>

            {/* Filtres */}
            <div className="flex items-center space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field"
              >
                <option value="updated">Dernière modification</option>
                <option value="created">Date de création</option>
                <option value="title">Titre A-Z</option>
              </select>
            </div>
          </div>

          {/* Actions en lot */}
          {selectedDrafts.length > 0 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <span className="small-text text-gray-600">
                {selectedDrafts.length} brouillon
                {selectedDrafts.length > 1 ? "s" : ""} sélectionné
                {selectedDrafts.length > 1 ? "s" : ""}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction("delete")}
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Liste des brouillons */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredDrafts.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="h3-title text-gray-900 mb-2">
              {drafts.length === 0 ? "Aucun brouillon" : "Aucun résultat"}
            </h3>
            <p className="body-text text-gray-600 mb-6">
              {drafts.length === 0
                ? "Commencez à écrire votre premier article !"
                : "Aucun brouillon ne correspond à vos critères de recherche."}
            </p>
            <button
              onClick={() => router.push("/create")}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Créer un article</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header de sélection */}
            <div className="card p-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    selectedDrafts.length === filteredDrafts.length &&
                    filteredDrafts.length > 0
                  }
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="h6-title text-gray-700">
                  Tout sélectionner
                </span>
              </label>

              <div className="flex items-center space-x-4 small-text text-gray-600">
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Dernière modification</span>
                </span>
              </div>
            </div>

            {/* Liste des cartes de brouillons */}
            {filteredDrafts.map((draft) => (
              <DraftCard
                key={draft.id}
                draft={draft}
                isSelected={selectedDrafts.includes(draft.id)}
                onSelect={() => toggleDraftSelection(draft.id)}
                onEdit={() => router.push(`/create?draft=${draft.id}`)}
                onPublish={() => handlePublishDraft(draft.id)}
                onDelete={() => handleDeleteDraft(draft.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}