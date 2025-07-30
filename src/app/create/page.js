// app/create/page.js - Page de création d'article pleine page
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import {
  ArrowLeft,
  Image,
  Calendar,
  Award,
  Plus,
  Clock,
  Smile,
} from "lucide-react";
import Header from "@/components/layout/Header";

// Emojis populaires
const POPULAR_EMOJIS = [
  "😊",
  "😂",
  "🤔",
  "👍",
  "❤️",
  "🎉",
  "🚀",
  "💡",
  "👏",
  "🔥",
  "💪",
  "🎯",
  "✨",
  "📈",
  "💻",
  "🌟",
  "👌",
  "🙌",
  "💼",
  "📱",
  "⚡",
  "🎊",
  "🏆",
  "💰",
  "📊",
  "🔧",
  "⭐",
  "💎",
  "🌈",
  "🎨",
];

export default function CreateArticlePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
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
      }
    }
    fetchCategories();
  }, []);

  // Fermer le picker d'emojis si on clique dehors
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Le titre et le contenu sont requis");
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
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/articles/${data.article.slug}`);
      } else {
        alert(data.error || "Erreur lors de la publication");
      }
    } catch (error) {
      console.error("Error creating article:", error);
      alert("Erreur lors de la publication");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
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

      // Repositionner le curseur après l'emoji
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 0);
    }
    setShowEmojiPicker(false);
  };

  const handleImageUpload = () => {
    // Pour l'instant, on simule l'ajout d'une image
    const imageText = "\n\n[Image à insérer]\n\n";
    setFormData({ ...formData, content: formData.content + imageText });
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

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 font-poppins">
              Créer un article
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Author Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center">
                <span className="text-white font-medium text-lg font-poppins">
                  {user.name?.charAt(0) || "U"}
                </span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 font-poppins">
                  {user.name}
                </h2>
                <p className="text-sm text-gray-500 font-poppins">
                  Publier un article sur TechPulse
                </p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title Input */}
            <div>
              <input
                type="text"
                placeholder="Donnez un titre captivant à votre article..."
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full text-3xl font-bold text-gray-900 placeholder-gray-400 border-none outline-none font-poppins"
                required
              />
            </div>

            {/* Description */}
            <div>
              <textarea
                placeholder="Ajoutez une description courte qui donnera envie de lire votre article..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full text-lg text-gray-700 placeholder-gray-400 border-none outline-none resize-none font-poppins"
                rows="3"
              />
            </div>

            {/* Main Content */}
            <div className="border-t border-gray-100 pt-6">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  placeholder="Commencez à écrire votre article... Partagez vos idées, vos expériences, vos découvertes !"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="w-full text-gray-700 placeholder-gray-400 border-none outline-none resize-none font-poppins text-lg leading-relaxed min-h-[400px]"
                  required
                />
              </div>
            </div>

            {/* Settings Section */}
            <div className="border-t border-gray-100 pt-6 space-y-6">
              {/* Category and Reading Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 font-poppins">
                    Catégorie *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-poppins"
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
                  <label className="block text-sm font-medium text-gray-700 mb-3 font-poppins">
                    Temps de lecture estimé
                  </label>
                  <input
                    type="text"
                    placeholder="ex: 5 min"
                    value={formData.readTime}
                    onChange={(e) =>
                      setFormData({ ...formData, readTime: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-poppins"
                  />
                </div>
              </div>

              {/* Featured Toggle */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 font-poppins">
                      Article en vedette
                    </span>
                    <p className="text-xs text-gray-500 font-poppins">
                      Cet article apparaîtra dans la section des articles
                      vedettes
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-gray-100 pt-6">
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

                  <button
                    type="button"
                    onClick={handleImageUpload}
                    className="p-3 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                    title="Ajouter une image"
                  >
                    <Image className="w-5 h-5" />
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
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors font-poppins"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors font-poppins"
                    title="Sauvegarder en brouillon"
                  >
                    Brouillon
                  </button>
                  <button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !formData.title.trim() ||
                      !formData.content.trim() ||
                      !formData.category
                    }
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors font-poppins flex items-center space-x-2"
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
      </div>
    </div>
  );
}
