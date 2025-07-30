// app/create/page.js - Page de création d'article améliorée (Phase 1)
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { useToast } from "@/context/ToastProvider";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useWordStats } from "@/components/shared/WordCounter";
import { useMarkdownShortcuts, } from "@/components/shared/MarkdownToolbar";
import SaveIndicator from "@/components/shared/SaveIndicator";
import WordCounter from "@/components/shared/WordCounter";
import MarkdownToolbar from "@/components/shared/MarkdownToolbar";
import { Image, Calendar, Award, Plus, Clock, Smile, Upload, X } from "lucide-react";
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
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [currentDraftId, setCurrentDraftId] = useState(null);
  
  const textareaRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const fileInputRef = useRef(null);

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

  // Fonction de sauvegarde automatique
  const handleAutoSave = async (data) => {
    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...data,
          readTime: readingTime, // Utiliser le temps calculé automatiquement
          isDraft: true
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setCurrentDraftId(result.article.id);
        setHasUnsavedChanges(false);
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error('Auto-save failed:', err);
      throw err;
    }
  };

  // Hook de sauvegarde automatique
  const { isSaving, forceSave, lastSaved } = useAutoSave(formData, {
    delay: 30000, // 30 secondes
    minLength: 10,
    enabled: !loading && user && (formData.title.trim() || formData.content.trim()),
    onSave: handleAutoSave,
    onError: (err) => {
      console.error('Auto-save error:', err);
      // Ne pas montrer d'erreur pour l'auto-save, c'est en arrière-plan
    }
  });

  // Raccourcis clavier markdown
  const { handleKeyDown } = useMarkdownShortcuts(textareaRef, (newContent) => {
    setFormData(prev => ({ ...prev, content: newContent }));
    setHasUnsavedChanges(true);
  });

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
      setFormData(prev => ({ ...prev, readTime: readingTime }));
    }
  }, [readingTime]);

  // Écouter l'événement de sauvegarde forcée (Ctrl+S)
  useEffect(() => {
    const handleForceSave = async () => {
      if (formData.title.trim()) {
        try {
          await forceSave();
          success('Brouillon sauvegardé manuellement');
        } catch (err) {
          error('Erreur lors de la sauvegarde');
        }
      }
    };

    document.addEventListener('forceSave', handleForceSave);
    return () => document.removeEventListener('forceSave', handleForceSave);
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
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
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
          isDraft: false
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

  // Fonction pour gérer l'upload d'images
  const handleImageUpload = async (file) => {
    if (!file) return;

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      error("Type de fichier non supporté. Utilisez JPG, PNG, WebP ou GIF.");
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      error("Le fichier est trop volumineux. Taille maximum: 5MB.");
      return;
    }

    setIsUploadingImage(true);
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: formDataUpload
      });

      const data = await response.json();

      if (data.success) {
        setUploadedImages(prev => [...prev, {
          url: data.imageUrl,
          fileName: data.fileName
        }]);

        const textarea = textareaRef.current;
        if (textarea) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const imageMarkdown = `\n![Image](${data.imageUrl})\n`;
          const newContent =
            formData.content.substring(0, start) +
            imageMarkdown +
            formData.content.substring(end);

          setFormData(prev => ({ ...prev, content: newContent }));
          setHasUnsavedChanges(true);

          setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(
              start + imageMarkdown.length, 
              start + imageMarkdown.length
            );
          }, 0);
        }

        success("Image uploadée avec succès !");
      } else {
        error(data.error || "Erreur lors de l'upload");
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      error("Erreur lors de l'upload de l'image");
    } finally {
      setIsUploadingImage(false);
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
    setFormData(prev => ({ ...prev, content: newContent }));
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
            {/* Indicateur de sauvegarde */}
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

        {/* Images uploadées */}
        {uploadedImages.length > 0 && (
          <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Images uploadées:</h3>
            <div className="flex flex-wrap gap-2">
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative">
                  <img 
                    src={image.url} 
                    alt={`Upload ${index + 1}`}
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <button
                    onClick={() => {
                      setUploadedImages(prev => prev.filter((_, i) => i !== index));
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Form Content */}
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

            {/* Input file caché pour les images */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  handleImageUpload(file);
                  e.target.value = '';
                }
              }}
              className="hidden"
            />

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

                  {/* Image Upload */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="p-3 text-gray-500 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Ajouter une image"
                  >
                    {isUploadingImage ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
                    ) : (
                      <Image className="w-5 h-5" />
                    )}
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
          <h3 className="text-sm font-medium text-blue-800 mb-2">💡 Raccourcis utiles :</h3>
          <div className="text-xs text-blue-700 space-y-1">
            <p><kbd className="bg-blue-200 px-1 rounded">Ctrl+B</kbd> Gras • <kbd className="bg-blue-200 px-1 rounded">Ctrl+I</kbd> Italique • <kbd className="bg-blue-200 px-1 rounded">Ctrl+K</kbd> Lien • <kbd className="bg-blue-200 px-1 rounded">Ctrl+S</kbd> Sauvegarder</p>
            <p>⏰ Sauvegarde automatique toutes les 30 secondes • 📊 Temps de lecture calculé automatiquement</p>
          </div>
        </div>
      </div>
    </div>
  );
}