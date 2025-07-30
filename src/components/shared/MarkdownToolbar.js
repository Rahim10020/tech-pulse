// components/shared/MarkdownToolbar.js - Barre d'outils Markdown
"use client";

import {
  Bold,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Minus,
} from "lucide-react";

export default function MarkdownToolbar({
  textareaRef,
  onContentChange,
  className = "",
}) {
  // Fonction utilitaire pour insérer du texte à la position du curseur
  const insertTextAtCursor = (beforeText, afterText = "", placeholder = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const textToInsert = selectedText || placeholder;

    const beforeCursor = textarea.value.substring(0, start);
    const afterCursor = textarea.value.substring(end);

    const newText =
      beforeCursor + beforeText + textToInsert + afterText + afterCursor;

    // Mettre à jour le contenu
    if (onContentChange) {
      onContentChange(newText);
    }

    // Repositionner le curseur
    setTimeout(() => {
      textarea.focus();
      const newCursorPosition = start + beforeText.length + textToInsert.length;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  };

  // Insérer du texte en début de ligne
  const insertLinePrefix = (prefix) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const value = textarea.value;

    // Trouver le début de la ligne actuelle
    let lineStart = start;
    while (lineStart > 0 && value[lineStart - 1] !== "\n") {
      lineStart--;
    }

    const beforeLine = value.substring(0, lineStart);
    const afterStart = value.substring(start);

    const newText = beforeLine + prefix + afterStart;

    if (onContentChange) {
      onContentChange(newText);
    }

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length);
    }, 0);
  };

  // Actions des boutons
  const actions = {
    bold: () => insertTextAtCursor("**", "**", "texte en gras"),
    italic: () => insertTextAtCursor("*", "*", "texte en italique"),
    link: () => insertTextAtCursor("[", "](https://)", "texte du lien"),
    code: () => insertTextAtCursor("`", "`", "code"),
    quote: () => insertLinePrefix("> "),
    h1: () => insertLinePrefix("# "),
    h2: () => insertLinePrefix("## "),
    bulletList: () => insertLinePrefix("- "),
    numberedList: () => insertLinePrefix("1. "),
    separator: () => insertTextAtCursor("\n\n---\n\n", "", ""),
  };

  const toolbarButtons = [
    {
      id: "bold",
      icon: Bold,
      title: "Gras (Ctrl+B)",
      action: actions.bold,
    },
    {
      id: "italic",
      icon: Italic,
      title: "Italique (Ctrl+I)",
      action: actions.italic,
    },
    {
      id: "separator-1",
      type: "separator",
    },
    {
      id: "h1",
      icon: Heading1,
      title: "Titre 1",
      action: actions.h1,
    },
    {
      id: "h2",
      icon: Heading2,
      title: "Titre 2",
      action: actions.h2,
    },
    {
      id: "separator-2",
      type: "separator",
    },
    {
      id: "link",
      icon: Link,
      title: "Lien",
      action: actions.link,
    },
    {
      id: "code",
      icon: Code,
      title: "Code",
      action: actions.code,
    },
    {
      id: "separator-3",
      type: "separator",
    },
    {
      id: "quote",
      icon: Quote,
      title: "Citation",
      action: actions.quote,
    },
    {
      id: "bulletList",
      icon: List,
      title: "Liste à puces",
      action: actions.bulletList,
    },
    {
      id: "numberedList",
      icon: ListOrdered,
      title: "Liste numérotée",
      action: actions.numberedList,
    },
    {
      id: "separator-4",
      type: "separator",
    },
    {
      id: "separator",
      icon: Minus,
      title: "Séparateur",
      action: actions.separator,
    },
  ];

  return (
    <div
      className={`flex items-center space-x-1 p-2 bg-gray-50 border border-gray-200 rounded-lg ${className}`}
    >
      {toolbarButtons.map((button) => {
        if (button.type === "separator") {
          return <div key={button.id} className="w-px h-6 bg-gray-300 mx-1" />;
        }

        const IconComponent = button.icon;

        return (
          <button
            key={button.id}
            type="button"
            onClick={button.action}
            title={button.title}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <IconComponent className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
}

// Hook pour les raccourcis clavier
export function useMarkdownShortcuts(textareaRef, onContentChange) {
  const handleKeyDown = (event) => {
    if (!event.ctrlKey && !event.metaKey) return;

    const actions = {
      b: () => insertTextAtCursor("**", "**", "texte en gras"),
      i: () => insertTextAtCursor("*", "*", "texte en italique"),
      k: () => insertTextAtCursor("[", "](https://)", "texte du lien"),
      s: (e) => {
        e.preventDefault();
        // Déclencher une sauvegarde manuelle si nécessaire
        const saveEvent = new CustomEvent("forceSave");
        document.dispatchEvent(saveEvent);
      },
    };

    const action = actions[event.key.toLowerCase()];
    if (action) {
      event.preventDefault();
      action(event);
    }
  };

  const insertTextAtCursor = (beforeText, afterText = "", placeholder = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const textToInsert = selectedText || placeholder;

    const beforeCursor = textarea.value.substring(0, start);
    const afterCursor = textarea.value.substring(end);

    const newText =
      beforeCursor + beforeText + textToInsert + afterText + afterCursor;

    if (onContentChange) {
      onContentChange(newText);
    }

    setTimeout(() => {
      textarea.focus();
      const newCursorPosition = start + beforeText.length + textToInsert.length;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  };

  return { handleKeyDown };
}
