// components/drafts/DraftCard.js - Carte d'un brouillon
"use client";

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Clock, 
  Edit, 
  Trash2, 
  Send, 
  Eye, 
  MoreVertical,
  Calendar,
  User,
  Tag,
  FileText
} from 'lucide-react';

export default function DraftCard({ 
  draft, 
  isSelected, 
  onSelect, 
  onEdit, 
  onPublish, 
  onDelete 
}) {
  const [showActions, setShowActions] = useState(false);

  // Calculer le temps écoulé
  const timeAgo = formatDistanceToNow(new Date(draft.updatedAt), {
    addSuffix: true,
    locale: fr
  });

  // Extraire un aperçu du contenu (premiers 150 caractères)
  const contentPreview = draft.content?.length > 150 
    ? draft.content.substring(0, 150) + '...'
    : draft.content || 'Aucun contenu';

  // Compter les mots
  const wordCount = draft.content ? draft.content.split(/\s+/).filter(word => word.length > 0).length : 0;

  return (
    <div className={`bg-white rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
      isSelected ? 'border-teal-500 bg-teal-50' : 'border-gray-200'
    }`}>
      <div className="p-6">
        <div className="flex items-start space-x-4">
          {/* Checkbox de sélection */}
          <div className="flex-shrink-0 pt-1">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onSelect}
              className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
          </div>

          {/* Contenu principal */}
          <div className="flex-1 min-w-0">
            {/* Header avec titre et actions */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2 font-poppins line-clamp-2">
                  {draft.title || 'Brouillon sans titre'}
                </h3>
                
                {/* Métadonnées */}
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span className="font-sans">Modifié {timeAgo}</span>
                  </div>
                  
                  {draft.category && (
                    <div className="flex items-center space-x-1">
                      <Tag className="w-4 h-4" />
                      <span className="font-sans">{draft.category.name}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-1">
                    <FileText className="w-4 h-4" />
                    <span className="font-sans">{wordCount} mots</span>
                  </div>
                  
                  {draft.readTime && (
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span className="font-sans">{draft.readTime}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Menu actions */}
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {showActions && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                    <button
                      onClick={() => {
                        onEdit();
                        setShowActions(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-poppins"
                    >
                      <Edit className="w-4 h-4 mr-3" />
                      Modifier
                    </button>
                    <button
                      onClick={() => {
                        onPublish();
                        setShowActions(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-green-700 hover:bg-green-50 transition-colors font-poppins"
                    >
                      <Send className="w-4 h-4 mr-3" />
                      Publier
                    </button>
                    <button
                      onClick={() => {
                        onDelete();
                        setShowActions(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors font-poppins"
                    >
                      <Trash2 className="w-4 h-4 mr-3" />
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Aperçu du contenu */}
            <div className="mb-4">
              <p className="text-gray-700 leading-relaxed font-sans text-sm line-clamp-3">
                {contentPreview}
              </p>
            </div>

            {/* Tags si disponibles */}
            {draft.tags && draft.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {draft.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 font-sans"
                  >
                    {tag.name}
                  </span>
                ))}
                {draft.tags.length > 3 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 font-sans">
                    +{draft.tags.length - 3} autres
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions en bas */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-1 text-xs text-gray-500 font-sans">
            <Calendar className="w-3 h-3" />
            <span>
              Créé le {new Date(draft.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors font-poppins"
            >
              <Edit className="w-4 h-4" />
              <span>Modifier</span>
            </button>
            
            <button
              onClick={onPublish}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors font-poppins"
            >
              <Send className="w-4 h-4" />
              <span>Publier</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay de sélection */}
      {isSelected && (
        <div className="absolute inset-0 bg-teal-500 bg-opacity-5 rounded-lg pointer-events-none" />
      )}
    </div>
  );
}