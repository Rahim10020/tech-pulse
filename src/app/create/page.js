// app/create/page.js - Page de création avec Drag & Drop intégré
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { useToast } from "@/context/ToastProvider";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useWordStats } from "@/components/shared/WordCounter";
import { useMarkdownShortcuts } from "@/components/shared/MarkdownToolbar";
import SaveIndicator from "@/components/shared/SaveIndicator";
import WordCounter from "@/components/shared/WordCounter";
import MarkdownToolbar from "@/components/shared/MarkdownToolbar";
import DragDropUpload from "@/components/shared/DragDropUpload";
import {
  Image,
  Calendar,
  Award,
  Plus,
  Clock,
  Smile,
  Upload,
  X,
  Video,
  Play,
} from "lucide-react";
import Header from "@/components/layout/Header";

// Emojis populaires
const POPULAR_EMOJIS = [
  "😊", "😂", "🤔", "👍", "❤️", "🎉", "🚀", "💡", "👏", "🔥",
  "💪", "🎯", "✨", "📈", "💻", "🌟", "👌", "🙌", "💼", "📱",
  "⚡", "🎊", "🏆", "💰", "📊", "🔧", "⭐", "💎", "🌈", "🎨",
];

export default function CreateArticlePage() {
  const { user, loading } = useAuth();
  const { success, error } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploadedMedias, setUploadedMedias] = useState([]); // Changé de uploadedImages à uploadedMedias
  const [showDragDrop, setShowDragDrop] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [currentDraftId, setCurrentDraftId] = useState(null);

  const textareaRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    description: "",
    category: "",
    tags: [],
    readTime: "",
    featured: false,
  });

  // Hook pour les statistiques de mots
  const { readingTime } = useWordStats(formData.content);

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
    enabled: !loading && user && (formData.title.trim() || formData.content.trim()),
    onSave: handleAutoSave,
    onError: (err) => {
      console.error("Auto-save error:", err);
    },
  });

  // Raccourcis clavier markdown
  const { handleKeyDown } = useMarkdownShortcuts(textareaRef, (newContent) => {
    setFormData((prev) => ({ ...prev, content: newContent }));
    setHasUnsavedChanges(true);
  });

  // Gestionnaires pour le drag & drop
  const handleFilesUploaded = (files) => {
    setUploadedMedias(prev => [...prev, ...files]);
    setHasUnsavedChanges(true);
  };

  const handleUploadError = (errorMessage) => {
    console.error('Upload error:', errorMessage);
    error(errorMessage);
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

  // Fermer le picker d'emojis si on clique dehors
  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const insertEmoji = (emoji) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent =
        formData.content.substring(0, start) +
        emoji +
        formData.content.substring(end);

      setFormData({ ...formData, content: newContent });
      setHasUnsavedChanges(true);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 0);
    }
    setShowEmojiPicker(false);
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

      <div className="max-w-4xl mx-auto px-6 py-4">
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

          {/* Category and Reading Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <select
                value={formData.category}
                onChange={(e) => {
                  setFormData({ ...formData, category: e.target.value });
                  setHasUnsavedChanges(true);
                }}
                className="w-full bg-gray-100 border-2 border-gray-200 font-poppins rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer"
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

            <div>
              <input
                type="text"
                placeholder={`Temps estimé: ${readingTime}`}
                value={formData.readTime}
                onChange={(e) => {
                  setFormData({ ...formData, readTime: e.target.value });
                  setHasUnsavedChanges(true);
                }}
                className="bg-gray-100 border-2 border-gray-200 font-poppins rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 w-full"
              />
            </div>
          </div>
        </div>

        {/* Compteur de mots */}
        <div className="mb-4">
          <WordCounter content={formData.content} />
        </div>

        {/* Section d'upload améliorée */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 font-poppins">
              Médias
            </h3>
            <button
              type="button"
              onClick={() => setShowDragDrop(!showDragDrop)}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors font-poppins"
            >
              <Upload className="w-4 h-4" />
              <span>{showDragDrop ? 'Masquer' : 'Ajouter des médias'}</span>
            </button>
          </div>

          {/* Composant Drag & Drop */}
          {showDragDrop && (
            <DragDropUpload
              onFilesUploaded={handleFilesUploaded}
              onError={handleUploadError}
              textareaRef={textareaRef}
              maxFiles={10}
              showPreview={true}
              className="mb-4"
            />
          )}

          {/* Galerie des médias uploadés */}
          {uploadedMedias.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="col-span-full text-sm font-medium text-gray-700 font-poppins mb-2">
                Médias ajoutés ({uploadedMedias.length})
              </h4>
              
              {uploadedMedias.map((media, index) => (
                <MediaPreviewCard
                  key={index}
                  media={media}
                  textareaRef={textareaRef}
                  onRemove={() => {
                    setUploadedMedias(prev => prev.filter((_, i) => i !== index));
                    setHasUnsavedChanges(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Title Input */}
            <div>
              <input
                type="text"
                placeholder="Donnez un titre captivant à votre article..."
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  setHasUnsavedChanges(true);
                }}
                className="w-full text-3xl bg-transparent font-bold text-gray-900 placeholder-gray-400 border-none outline-none font-sans pt-2 pb-2 pr-4 pl-0"
                required
              />
            </div>

            {/* Toolbar Markdown */}
            <MarkdownToolbar
              textareaRef={textareaRef}
              onContentChange={handleContentChange}
            />

            {/* Main Content */}
            <div className="border-t border-gray-200 pt-4">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  placeholder="Commencez à écrire votre article... Partagez vos idées, vos expériences, vos découvertes !"
                  value={formData.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full text-gray-700 bg-transparent font-medium placeholder-gray-400 border-none outline-none resize-none font-sans pt-2 pb-2 pr-4 pl-0 text-lg leading-relaxed min-h-[400px]"
                  required
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                {/* Media Icons */}
                <div className="flex items-center space-x-2">
                  {/* Emoji Picker */}
                  <div className="relative" ref={emojiPickerRef}>
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-3 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                      title="Ajouter un emoji"
                    >
                      <Smile className="w-5 h-5" />
                    </button>

                    {showEmojiPicker && (
                      <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10">
                        <div className="grid grid-cols-6 gap-1 w-48">
                          {POPULAR_EMOJIS.map((emoji, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => insertEmoji(emoji)}
                              className="w-8 h-8 text-lg hover:bg-gray-100 rounded flex items-center justify-center transition-colors"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Drag & Drop Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowDragDrop(!showDragDrop)}
                    className="p-3 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                    title="Upload de médias"
                  >
                    <Upload className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    className="p-3 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                    title="Ajouter un événement"
                  >
                    <Calendar className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className="p-3 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                    title="Célébrer une réussite"
                  >
                    <Award className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className="p-3 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                    title="Plus d'options"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-4">
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
                    className="disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors font-poppins text-sm md:text-base font-medium"
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
            </div>
          </form>
        </div>

        {/* Aide rapide */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            💡 Raccourcis utiles :
          </h3>
          <div className="text-xs text-blue-700 space-y-1">
            <p>
              <kbd className="bg-blue-200 px-1 rounded">Ctrl+B</kbd> Gras •{" "}
              <kbd className="bg-blue-200 px-1 rounded">Ctrl+I</kbd> Italique •{" "}
              <kbd className="bg-blue-200 px-1 rounded">Ctrl+K</kbd> Lien •{" "}
              <kbd className="bg-blue-200 px-1 rounded">Ctrl+S</kbd> Sauvegarder
            </p>
            <p>
              ⏰ Sauvegarde automatique toutes les 30 secondes • 📊 Temps de
              lecture calculé automatiquement • 🎬 Drag & drop pour images/vidéos/GIFs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant pour prévisualiser les médias
function MediaPreviewCard({ media, textareaRef, onRemove }) {
  const isVideo = media.mediaCategory === 'videos';
  const isGif = media.mediaCategory === 'gifs';

  const handleInsert = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      const markdownText = isVideo 
        ? `\n<video controls width="100%" style="max-width: 600px;">\n  <source src="${media.fileUrl}" type="${media.fileType}">\n  Votre navigateur ne supporte pas la lecture de vidéos.\n</video>\n\n`
        : `\n![${media.originalName || 'Image'}](${media.fileUrl})\n\n`;
      
      const start = textarea.selectionStart;
      const newContent = 
        textarea.value.substring(0, start) +
        markdownText +
        textarea.value.substring(start);
      
      textarea.value = newContent;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.focus();
      
      // Repositionner le curseur
      setTimeout(() => {
        const newPosition = start + markdownText.length;
        textarea.setSelectionRange(newPosition, newPosition);
      }, 0);
    }
  };

  return (
    <div className="relative group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Aperçu du média */}
      <div className="aspect-square bg-gray-100 flex items-center justify-center">
        {isVideo ? (
          <div className="relative w-full h-full">
            <video 
              src={media.fileUrl} 
              className="w-full h-full object-cover"
              muted
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <Play className="w-8 h-8 text-white" />
            </div>
          </div>
        ) : (
          <img 
            src={media.fileUrl} 
            alt={media.originalName || 'Media'}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Actions en hover */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div className="flex space-x-2">
          <button
            onClick={handleInsert}
            className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            title="Insérer à nouveau"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={onRemove}
            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            title="Supprimer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Informations du fichier */}
      <div className="p-2">
        <p className="text-xs text-gray-600 truncate font-sans">
          {media.originalName || media.fileName}
        </p>
        <p className="text-xs text-gray-500 font-sans">
          {media.fileSizeMB} MB • {isVideo ? 'Vidéo' : isGif ? 'GIF' : 'Image'}
        </p>
      </div>
    </div>
  );
}