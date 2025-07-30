// components/shared/WordCounter.js - Compteur de mots et estimation de lecture
"use client";

import { Clock, FileText } from "lucide-react";

export default function WordCounter({ content = "", className = "" }) {
  // Calculer le nombre de mots
  const getWordCount = (text) => {
    if (!text || text.trim() === "") return 0;

    // Nettoyer le texte (enlever markdown, espaces multiples, etc.)
    const cleanText = text
      .replace(/[#*_`~\[\]()]/g, "") // enlever les caractères markdown
      .replace(/!\[.*?\]\(.*?\)/g, "") // enlever les images markdown
      .replace(/\[.*?\]\(.*?\)/g, "") // enlever les liens markdown
      .replace(/\s+/g, " ") // remplacer les espaces multiples par un seul
      .trim();

    if (cleanText === "") return 0;

    return cleanText.split(" ").length;
  };

  // Calculer le nombre de caractères
  const getCharCount = (text) => {
    return text ? text.length : 0;
  };

  // Estimer le temps de lecture (200 mots par minute en moyenne)
  const getReadingTime = (wordCount) => {
    if (wordCount === 0) return "0 min";

    const minutes = Math.ceil(wordCount / 200);
    return `${minutes} min`;
  };

  const wordCount = getWordCount(content);
  const charCount = getCharCount(content);
  const readingTime = getReadingTime(wordCount);

  return (
    <div
      className={`flex items-center space-x-6 text-sm text-gray-600 ${className}`}
    >
      {/* Nombre de mots */}
      <div className="flex items-center space-x-1">
        <FileText className="w-4 h-4" />
        <span className="font-medium">
          {wordCount.toLocaleString()} mot{wordCount !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Nombre de caractères */}
      <div className="flex items-center space-x-1">
        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
          {charCount.toLocaleString()} caractères
        </span>
      </div>

      {/* Temps de lecture estimé */}
      <div className="flex items-center space-x-1">
        <Clock className="w-4 h-4" />
        <span className="font-medium">≈ {readingTime} de lecture</span>
      </div>

      {/* Indicateur de progression (optionnel) */}
      {wordCount > 0 && (
        <div className="flex items-center space-x-1">
          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{
                width: `${Math.min(100, (wordCount / 500) * 100)}%`,
              }}
            />
          </div>
          <span className="text-xs text-gray-500">
            {Math.min(100, Math.round((wordCount / 500) * 100))}%
          </span>
        </div>
      )}
    </div>
  );
}

// Hook utilitaire pour utiliser les statistiques ailleurs
export function useWordStats(content) {
  const getWordCount = (text) => {
    if (!text || text.trim() === "") return 0;

    const cleanText = text
      .replace(/[#*_`~\[\]()]/g, "")
      .replace(/!\[.*?\]\(.*?\)/g, "")
      .replace(/\[.*?\]\(.*?\)/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (cleanText === "") return 0;
    return cleanText.split(" ").length;
  };

  const getReadingTime = (wordCount) => {
    if (wordCount === 0) return "0 min";
    const minutes = Math.ceil(wordCount / 200);
    return `${minutes} min`;
  };

  const wordCount = getWordCount(content);
  const charCount = content ? content.length : 0;
  const readingTime = getReadingTime(wordCount);

  return {
    wordCount,
    charCount,
    readingTime,
    readingTimeMinutes: Math.ceil(wordCount / 200),
  };
}
