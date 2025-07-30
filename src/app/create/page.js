// app/create/page.js - Page de création d'article
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Image, Calendar, Award, Plus, Clock, Smile } from "lucide-react";
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

      <div className="max-w-4xl mx-auto px-6 py-4">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-poppins">
            Publier un article
          </h1>
          {/* Category and Reading Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
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
                placeholder="temps de lecture, ex: 5 min"
                value={formData.readTime}
                onChange={(e) =>
                  setFormData({ ...formData, readTime: e.target.value })
                }
                className="bg-gray-100 border-2 border-gray-200 font-poppins rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 w-full"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-transparent">
          {/* Form Content */}
          <form
            onSubmit={handleSubmit}
            className="pt-3 pb-3 pr-3 pl-0 space-y-3"
          >
            {/* Title Input */}
            <div>
              <input
                type="text"
                placeholder="Donnez un titre captivant à votre article..."
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full text-3xl bg-transparent font-bold text-gray-900 placeholder-gray-400 border-none outline-none font-sans pt-2 pb-2 pr-4 pl-0"
                required
              />
            </div>

            {/* Main Content */}
            <div className="border-t border-gray-200 pt-3">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  placeholder="Commencez à écrire votre article... Partagez vos idées, vos expériences, vos découvertes !"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="w-full text-gray-700 bg-transparent font-medium placeholder-gray-400 border-none outline-none resize-none font-sans pt-2 pb-2 pr-4 pl-0 text-lg leading-relaxed min-h-[300px]"
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
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium transition-colors font-poppins text-sm md:text-base"
                  >
                    Annuler
                  </button>

                  <button
                    type="button"
                    className="px-6 py-2 text-gray-700 hover:bg-gray-100 text-sm md:text-base rounded-md font-medium transition-colors font-poppins"
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
      </div>
    </div>
  );
}
