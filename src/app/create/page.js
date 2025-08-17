// app/create/page.js - Page de création finale avec Tiptap seulement
"use client";

import { useState, useEffect } from "react";
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
    category: "",
    tags: [],
    readTime: "",
    featured: false,
  });

  // Calculer le temps de lecture à partir du contenu HTML
  const calculateReadingTime = (htmlContent) => {
    const textContent = htmlContent.replace(/<[^>]*>/g, "");
    const wordCount = textContent
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const readingTimeMinutes = Math.ceil(wordCount / 200);
    return `${readingTimeMinutes} min`;
  };

  const readingTime = calculateReadingTime(formData.content);

  // Enregistrer un brouillon automatiquement
  const handleAutoSave = async (data) => {
    try {
      const response = await fetch("/api/drafts/auto-save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...data,
          readTime: readingTime,
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
  };

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
  const handleTiptapImageUpload = async (file) => {
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
  };

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
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        error("Erreur lors du chargement des catégories");
      }
    }
    fetchCategories();
  }, []);

  // Détecter les changements non sauvegardés
  useEffect(() => {
    const hasContent = formData.title.trim() || formData.content.trim();
    setHasUnsavedChanges(hasContent && !isSaving);
  }, [formData, isSaving]);

  // Mettre à jour automatiquement le temps de lecture
  useEffect(() => {
    if (readingTime && readingTime !== formData.readTime) {
      setFormData((prev) => ({ ...prev, readTime: readingTime }));
    }
  }, [readingTime]);

  // Écouter l'événement de sauvegarde forcée (Ctrl+S)
  useEffect(() => {
    const handleForceSave = async () => {
      if (formData.title.trim()) {
        try {
          await forceSave();
          success("Draft saved manually");
        } catch (err) {
          error("Erreur lors de la sauvegarde");
        }
      }
    };

    document.addEventListener("forceSave", handleForceSave);
    return () => document.removeEventListener("forceSave", handleForceSave);
  }, [formData.title, forceSave, success, error]);

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

  // Fonction pour publier l'article
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      error("Title and content are required");
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
          isDraft: false,
        }),
      });

      const data = await response.json();

      if (data.success) {
        success("Article successfully published!");
        setHasUnsavedChanges(false);
        router.push(`/articles/${data.article.slug}`);
      } else {
        error(data.error || "Erreur lors de la publication");
      }
    } catch (err) {
      console.error("Error creating article:", err);
      error("Error while publishing");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction pour sauvegarder en brouillon manuellement
  const handleSaveDraft = async () => {
    if (!formData.title.trim()) {
      error("Title is required to save a draft");
      return;
    }

    setIsSavingDraft(true);
    try {
      await forceSave();
      success("Draft saved successfully!");
    } catch (err) {
      console.error("Error saving draft:", err);
      error("Error saving draft");
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to quit?"
      );
      if (!confirmLeave) return;
    }
    router.back();
  };

  // Fonction pour gérer les changements de contenu
  const handleContentChange = (newContent) => {
    setFormData((prev) => ({ ...prev, content: newContent }));
    setHasUnsavedChanges(true);
  };

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
              Publish an article
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
              onChange={(e) => {
                setFormData({ ...formData, category: e.target.value });
                setHasUnsavedChanges(true);
              }}
              className="input-field"
              required
            >
              <option value="">Choose a category</option>
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
              Reading time:{" "}
              <span className="font-medium">{readingTime}</span>
            </div>
            <div className="small-text text-gray-500">
              {
                formData.content
                  .replace(/<[^>]*>/g, "")
                  .split(/\s+/)
                  .filter((word) => word.length > 0).length
              }{" "}
              words
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
                placeholder="Titre..."
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  setHasUnsavedChanges(true);
                }}
                className="w-full text-3xl bg-transparent font-bold text-gray-900 placeholder-gray-400 border-none outline-none"
                required
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
                  disabled={isSavingDraft || !formData.title.trim()}
                  className="btn-secondary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  title="Sauvegarder en brouillon (Ctrl+S)"
                >
                  {isSavingDraft ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
                      <span>Sauvegarde...</span>
                    </>
                  ) : (
                    <span>Brouillon</span>
                  )}
                </button>

                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !formData.title.trim() ||
                    !formData.content.trim() ||
                    !formData.category
                  }
                  className="btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            </div>
          </form>
        </div>

        {/* Aide rapide */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="h6-title text-blue-800 mb-2">
            💡 Éditeur moderne Tiptap :
          </h3>
          <div className="small-text text-blue-700 space-y-1">
            <p>
              ✨ <strong>Formatage visuel :</strong> Sélectionnez du texte et
              utilisez la toolbar
            </p>
            <p>
              🖼️ <strong>Images :</strong> Glissez-déposez ou cliquez sur
              l'icône 📷 dans la toolbar
            </p>
            <p>
              🔗 <strong>Liens :</strong> Sélectionnez du texte et cliquez sur
              l'icône lien
            </p>
            <p>
              ⏰ <strong>Sauvegarde automatique</strong> toutes les 30 secondes
              • Temps de lecture calculé automatiquement
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}