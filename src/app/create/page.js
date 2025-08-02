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
          success("Brouillon sauvegardé manuellement");
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
      error("Le titre et le contenu sont requis");
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
        success("Article publié avec succès !");
        setHasUnsavedChanges(false);
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

  // Fonction pour sauvegarder en brouillon manuellement
  const handleSaveDraft = async () => {
    if (!formData.title.trim()) {
      error("Le titre est requis pour sauvegarder un brouillon");
      return;
    }

    setIsSavingDraft(true);
    try {
      await forceSave();
      success("Brouillon sauvegardé avec succès !");
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
      <div className="max-w-4xl mx-auto px-6 py-4 pt-20">
        
        <div>
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 font-poppins mb-2">
                Publier un article
              </h1>
              <SaveIndicator
                isSaving={isSaving || isSavingDraft}
                lastSaved={lastSaved}
                hasUnsavedChanges={hasUnsavedChanges}
              />
            </div>

            {/* Sélection de catégorie */}
            <div className="mb-6">
              <select
                value={formData.category}
                onChange={(e) => {
                  setFormData({ ...formData, category: e.target.value });
                  setHasUnsavedChanges(true);
                }}
                className="w-full max-w-sm bg-gray-100 font-poppins rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                required
              >
                <option value="">Choisissez une catégorie</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Informations de l'article */}
            <div className="text-right">
              <div className="text-sm text-gray-600 font-sans">
                Temps de lecture:{" "}
                <span className="font-medium">{readingTime}</span>
              </div>
              <div className="text-xs text-gray-500 font-sans">
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
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
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
                  className="w-full text-3xl bg-transparent font-bold text-gray-900 placeholder-gray-400 border-none outline-none font-sans"
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
                <div className="flex items-center justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium transition-colors font-poppins text-sm md:text-base"
                  >
                    Annuler
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={isSavingDraft || !formData.title.trim()}
                    className="disabled:bg-gray-300 disabled:cursor-not-allowed px-6 py-2 text-gray-700 hover:bg-gray-100 text-sm md:text-base rounded-md font-medium transition-colors font-poppins flex items-center space-x-2"
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
                    className="disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition-colors font-poppins text-sm md:text-base font-medium"
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
        </div>
        

        {/* Aide rapide */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            💡 Éditeur moderne Tiptap :
          </h3>
          <div className="text-xs text-blue-700 space-y-1">
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
