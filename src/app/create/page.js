// app/create/page.js - Version corrigée avec logique clarifiée
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { useToast } from "@/context/ToastProvider";
import { useAutoSave } from "@/hooks/useAutoSave";
import SaveIndicator from "@/components/shared/SaveIndicator";
import TiptapEditor from "@/components/shared/TiptapEditor";
import Header from "@/components/layout/Header";

export default function CreateArticlePage() {
  const { user, loading } = useAuth();
  const { success, error } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [categories, setCategories] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [currentDraftId, setCurrentDraftId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    description: "",
    category: "", // Vide par défaut = sera traité comme "non-classe"
    tags: [],
    readTime: "",
    featured: false,
  });

  // Calculer le temps de lecture à partir du contenu HTML
  const calculateReadingTime = useCallback((htmlContent) => {
    const textContent = htmlContent.replace(/<[^>]*>/g, "");
    const wordCount = textContent
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const readingTimeMinutes = Math.ceil(wordCount / 200);
    return `${readingTimeMinutes} min`;
  }, []);

  // Fonction pour mettre à jour les données du formulaire
  const updateFormData = useCallback((field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      setHasUnsavedChanges(true);
      return newData;
    });
  }, []);

  // Calculer le temps de lecture
  const readingTime = calculateReadingTime(formData.content);

  // **FONCTION D'AUTO-SAVE CORRIGÉE**
  const handleAutoSave = useCallback(async (data) => {
    try {
      const response = await fetch("/api/drafts/auto-save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...data,
          readTime: calculateReadingTime(data.content),
          existingDraftId: currentDraftId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        if (result.isNew) {
          setCurrentDraftId(result.article.id);
        }
        setHasUnsavedChanges(false);
        return result;
      } else {
        console.error("Auto-save API error:", result.error);
        throw new Error(result.error);
      }
    } catch (err) {
      console.error("Auto-save failed:", err);
      throw err;
    }
  }, [currentDraftId, calculateReadingTime]);

  // Hook de sauvegarde automatique
  const { isSaving, forceSave, lastSaved } = useAutoSave(formData, {
    delay: 30000,
    minLength: 10,
    enabled:
      !loading && user && (formData.title.trim() || formData.content.trim()),
    onSave: handleAutoSave,
    onError: (err) => {
      console.error("Auto-save error:", err);
    },
  });

  // Gestionnaire pour l'upload d'images depuis Tiptap
  const handleTiptapImageUpload = useCallback(async (file) => {
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
        setHasUnsavedChanges(true);
        return data;
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      error("Erreur lors de l'upload de l'image");
      throw err;
    }
  }, [error]);

  // Rediriger si non connecté
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Charger les catégories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories?type=all");
        const data = await response.json();
        // Filtrer pour exclure la catégorie "non-classe" des options
        const filteredCategories = data.filter(cat => cat.slug !== "non-classe");
        setCategories(filteredCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        error("Erreur lors du chargement des catégories");
      }
    }
    fetchCategories();
  }, [error]);

  // Mettre à jour automatiquement le temps de lecture
  useEffect(() => {
    if (readingTime && readingTime !== formData.readTime) {
      setFormData(prev => ({ ...prev, readTime: readingTime }));
    }
  }, [readingTime, formData.readTime]);

  // Écouter l'événement de sauvegarde forcée (Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        if (formData.title.trim()) {
          handleSaveDraft();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [formData.title]);

  // Avertir avant de quitter si changements non sauvegardés
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // **FONCTION DE PUBLICATION CORRIGÉE**
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation côté client
    if (!formData.title.trim()) {
      error("Le titre est requis");
      return;
    }

    if (!formData.content.trim()) {
      error("Le contenu est requis");
      return;
    }

    if (!formData.category) {
      error("Veuillez sélectionner une catégorie pour publier l'article");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          // Pas de isDraft: false ici, c'est géré côté serveur
        }),
      });

      const data = await response.json();

      if (data.success) {
        success("Article publié avec succès!");
        setHasUnsavedChanges(false);

        // Si on avait un brouillon, il faut le supprimer ou le marquer comme publié
        if (currentDraftId) {
          // Le brouillon sera automatiquement "converti" en article publié
          setCurrentDraftId(null);
        }

        router.push(`/articles/${data.article.slug}`);
      } else {
        error(data.error || "Erreur lors de la publication");
      }
    } catch (err) {
      console.error("Error creating article:", err);
      error("Erreur lors de la publication");
    } finally {
      setIsSubmitting(false);
    }
  };

  // **FONCTION DE SAUVEGARDE MANUELLE CORRIGÉE**
  const handleSaveDraft = async () => {
    if (!formData.title.trim() && !formData.content.trim()) {
      error("Au moins un titre ou du contenu est requis pour sauvegarder");
      return;
    }

    setIsSavingDraft(true);
    try {
      await forceSave();
      success("Brouillon sauvegardé avec succès!");
    } catch (err) {
      console.error("Error saving draft:", err);
      error("Erreur lors de la sauvegarde du brouillon");
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        "Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir quitter ?"
      );
      if (!confirmLeave) return;
    }
    router.back();
  };

  // Fonction pour gérer les changements de contenu
  const handleContentChange = useCallback((newContent) => {
    updateFormData("content", newContent);
  }, [updateFormData]);

  // Gestionnaire pour les changements de titre
  const handleTitleChange = useCallback((e) => {
    updateFormData("title", e.target.value);
  }, [updateFormData]);

  // Gestionnaire pour les changements de catégorie
  const handleCategoryChange = useCallback((e) => {
    updateFormData("category", e.target.value);
  }, [updateFormData]);

  // Détermine si on peut publier
  const canPublish = formData.title.trim() &&
    formData.content.trim() &&
    formData.category &&
    !isSubmitting;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Contenu principal */}
      <div className="container-sm py-4 pt-20">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex-1">
            <h1 className="h1-title text-gray-900 mb-2">
              Créer un article
            </h1>
            <SaveIndicator
              isSaving={isSaving || isSavingDraft}
              lastSaved={lastSaved}
              hasUnsavedChanges={hasUnsavedChanges}
            />
          </div>

          {/* Sélection de catégorie */}
          <div className="md:w-64">
            <select
              value={formData.category}
              onChange={handleCategoryChange}
              className="input-field"
            >
              <option value="">
                {currentDraftId ? "📝 Brouillon (non classé)" : "Sélectionner une catégorie..."}
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Informations de l'article */}
          <div className="text-right">
            <div className="small-text text-gray-600">
              Temps de lecture:{" "}
              <span className="font-medium">{readingTime}</span>
            </div>
            <div className="small-text text-gray-500">
              {
                formData.content
                  .replace(/<[^>]*>/g, "")
                  .split(/\s+/)
                  .filter((word) => word.length > 0).length
              }{" "}
              mots
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title Input */}
            <div className="p-6 pb-0">
              <input
                type="text"
                placeholder="Titre de votre article..."
                value={formData.title}
                onChange={handleTitleChange}
                className="w-full text-3xl bg-transparent font-bold text-gray-900 placeholder-gray-400 border-none outline-none"
              />
            </div>

            {/* Éditeur Tiptap */}
            <div className="px-6">
              <TiptapEditor
                content={formData.content}
                onChange={handleContentChange}
                placeholder="Commencez à écrire votre article... Partagez vos idées, vos expériences, vos découvertes !"
                onImageUpload={handleTiptapImageUpload}
                className="min-h-[500px]"
              />
            </div>

            {/* Footer Actions */}
            <div className="border-t border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="btn-secondary w-full sm:w-auto"
                >
                  Annuler
                </button>

                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={isSavingDraft || (!formData.title.trim() && !formData.content.trim())}
                  className="btn-secondary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  title="Sauvegarder en brouillon (Ctrl+S)"
                >
                  {isSavingDraft ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
                      <span>Sauvegarde...</span>
                    </>
                  ) : (
                    <span>Sauvegarder le brouillon</span>
                  )}
                </button>

                <button
                  type="submit"
                  disabled={!canPublish}
                  className="btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  title={!formData.category ? "Sélectionnez une catégorie pour publier" : ""}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Publication...</span>
                    </>
                  ) : (
                    <span>Publier l'article</span>
                  )}
                </button>
              </div>

              {/* Message d'aide */}
              {!formData.category && (formData.title.trim() || formData.content.trim()) && (
                <div className="mt-3 text-center">
                  <p className="small-text text-orange-600">
                    💡 Sélectionnez une catégorie pour pouvoir publier votre article
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Aide rapide */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="h6-title text-blue-800 mb-2">
            💡 Comment ça marche :
          </h3>
          <div className="small-text text-blue-700 space-y-1">
            <p>
              📝 <strong>Brouillons automatiques :</strong> Vos modifications sont sauvegardées automatiquement toutes les 30 secondes
            </p>
            <p>
              💾 <strong>Sauvegarde manuelle :</strong> Utilisez Ctrl+S ou le bouton "Sauvegarder" pour forcer la sauvegarde
            </p>
            <p>
              📂 <strong>Catégories :</strong> Sélectionnez une catégorie pour pouvoir publier (obligatoire)
            </p>
            <p>
              🚀 <strong>Publication :</strong> Une fois publié, l'article sera visible par tous les visiteurs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}