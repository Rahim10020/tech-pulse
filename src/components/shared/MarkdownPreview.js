// components/shared/MarkdownPreview.js - Aperçu markdown en temps réel
'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Edit } from 'lucide-react';

// Parser markdown simple (sans dépendance externe)
function parseMarkdown(text) {
  if (!text) return '';
  
  return text
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 mb-3 mt-6">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-gray-900 mb-4 mt-8">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mb-6 mt-8">$1</h1>')
    
    // Bold et Italic
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    
    // Code inline
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">$1</code>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-teal-600 hover:text-teal-700 underline" target="_blank" rel="noopener noreferrer">$1</a>')
    
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4 shadow-sm" />')
    
    // Quotes
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 py-2 my-4 text-gray-700 italic bg-gray-50">$1</blockquote>')
    
    // Lists
    .replace(/^\* (.*$)/gim, '<li class="mb-1">$1</li>')
    .replace(/^- (.*$)/gim, '<li class="mb-1">$1</li>')
    .replace(/^(\d+)\. (.*$)/gim, '<li class="mb-1">$2</li>')
    
    // Horizontal rules
    .replace(/^---$/gim, '<hr class="my-8 border-gray-300" />')
    
    // Line breaks
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/\n/g, '<br />');
}

// Wrapper pour les listes
function wrapLists(html) {
  // Wrapper pour les listes non ordonnées
  html = html.replace(/(<li class="mb-1">.*?<\/li>)(?!\s*<li)/gs, (match) => {
    const items = match.match(/<li class="mb-1">.*?<\/li>/g);
    if (items && items.length > 1) {
      return `<ul class="list-disc list-inside mb-4 space-y-1">${match}</ul>`;
    }
    return `<ul class="list-disc list-inside mb-4">${match}</ul>`;
  });
  
  return html;
}

export default function MarkdownPreview({ 
  content, 
  title = '',
  className = '' 
}) {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [processedContent, setProcessedContent] = useState('');

  // Parser le markdown quand le contenu change
  useEffect(() => {
    if (content) {
      let parsed = parseMarkdown(content);
      parsed = wrapLists(parsed);
      // Wrapper dans des paragraphes
      if (parsed && !parsed.startsWith('<')) {
        parsed = `<p class="mb-4">${parsed}</p>`;
      }
      setProcessedContent(parsed);
    } else {
      setProcessedContent('');
    }
  }, [content]);

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header avec toggle */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <h3 className="text-sm font-medium text-gray-700">
          {isPreviewMode ? 'Aperçu de l\'article' : 'Mode édition'}
        </h3>
        
        <button
          onClick={() => setIsPreviewMode(!isPreviewMode)}
          className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        >
          {isPreviewMode ? (
            <>
              <Edit className="w-4 h-4" />
              <span>Éditer</span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              <span>Aperçu</span>
            </>
          )}
        </button>
      </div>

      {/* Contenu de l'aperçu */}
      {isPreviewMode && (
        <div className="p-6">
          {/* Titre de l'article */}
          {title && (
            <h1 className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              {title}
            </h1>
          )}
          
          {/* Contenu parsé */}
          {processedContent ? (
            <div 
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Eye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Aperçu de votre article</p>
              <p className="text-sm">Commencez à écrire pour voir l'aperçu ici</p>
            </div>
          )}
        </div>
      )}
      
      {/* Message quand pas en mode aperçu */}
      {!isPreviewMode && (
        <div className="p-6 text-center text-gray-500">
          <EyeOff className="w-8 h-8 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">Cliquez sur "Aperçu" pour voir le rendu de votre article</p>
        </div>
      )}
    </div>
  );
}

// Hook pour utiliser l'aperçu dans d'autres composants
export function useMarkdownPreview(content, title) {
  const [processedContent, setProcessedContent] = useState('');

  useEffect(() => {
    if (content) {
      let parsed = parseMarkdown(content);
      parsed = wrapLists(parsed);
      if (parsed && !parsed.startsWith('<')) {
        parsed = `<p class="mb-4">${parsed}</p>`;
      }
      setProcessedContent(parsed);
    } else {
      setProcessedContent('');
    }
  }, [content]);

  return {
    processedContent,
    hasContent: !!content?.trim()
  };
}