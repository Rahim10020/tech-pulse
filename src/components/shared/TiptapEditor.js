// components/shared/TiptapEditor.js - Éditeur Tiptap corrigé et simplifié
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import DropCursor from "@tiptap/extension-dropcursor";
import { useCallback, useEffect, useState } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  X,
} from "lucide-react";

export default function TiptapEditor({
  content,
  onChange,
  placeholder = "Commencez à écrire votre article...",
  className = "",
  onImageUpload,
}) {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg my-4 shadow-sm",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-teal-600 hover:text-teal-700 underline cursor-pointer",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      DropCursor.configure({
        color: "#10b981",
        width: 2,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none focus:outline-none min-h-[400px] px-4 py-3",
      },
      // Gestion du drag & drop d'images
      handleDrop: (view, event, slice, moved) => {
        if (
          !moved &&
          event.dataTransfer &&
          event.dataTransfer.files &&
          event.dataTransfer.files[0]
        ) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith("image/")) {
            event.preventDefault();
            handleImageUpload(file, view, event);
            return true;
          }
        }
        return false;
      },
    },
  });

  // Mettre à jour le contenu quand il change de l'extérieur
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Gestion de l'upload d'images
  const handleImageUpload = useCallback(
    async (file, view, event) => {
      if (!onImageUpload) return;

      try {
        const imageData = await onImageUpload(file);
        if (imageData && imageData.fileUrl) {
          if (view && event) {
            // Drag & drop - insérer à la position du drop
            const coords = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            });
            if (coords) {
              view.dispatch(
                view.state.tr.replaceWith(
                  coords.pos,
                  coords.pos,
                  view.state.schema.nodes.image.create({
                    src: imageData.fileUrl,
                    alt: imageData.originalName || "Image",
                    title: imageData.originalName || "Image",
                  })
                )
              );
            }
          } else {
            // Upload via bouton - insérer à la position du curseur
            editor
              ?.chain()
              .focus()
              .setImage({
                src: imageData.fileUrl,
                alt: imageData.originalName || "Image",
                title: imageData.originalName || "Image",
              })
              .run();
          }
        }
      } catch (error) {
        console.error("Erreur lors de l'upload d'image:", error);
      }
    },
    [onImageUpload, editor]
  );

  // Upload d'image via input file
  const handleImageButtonClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        await handleImageUpload(file);
      }
    };
    input.click();
  };

  // Fonctions pour les boutons de la toolbar
  const toggleBold = () => editor?.chain().focus().toggleBold().run();
  const toggleItalic = () => editor?.chain().focus().toggleItalic().run();
  const toggleStrike = () => editor?.chain().focus().toggleStrike().run();
  const toggleCode = () => editor?.chain().focus().toggleCode().run();
  const toggleHeading1 = () =>
    editor?.chain().focus().toggleHeading({ level: 1 }).run();
  const toggleHeading2 = () =>
    editor?.chain().focus().toggleHeading({ level: 2 }).run();
  const toggleHeading3 = () =>
    editor?.chain().focus().toggleHeading({ level: 3 }).run();
  const toggleBulletList = () =>
    editor?.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () =>
    editor?.chain().focus().toggleOrderedList().run();
  const toggleBlockquote = () =>
    editor?.chain().focus().toggleBlockquote().run();
  const undo = () => editor?.chain().focus().undo().run();
  const redo = () => editor?.chain().focus().redo().run();

  // Ajouter un lien avec modal custom
  const addLink = () => {
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);
    setLinkUrl("");
    setShowLinkModal(true);
  };

  const handleLinkSubmit = () => {
    if (linkUrl) {
      editor?.chain().focus().setLink({ href: linkUrl }).run();
    }
    setShowLinkModal(false);
    setLinkUrl("");
  };

  if (!editor) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 min-h-[400px] flex items-center justify-center">
        <div className="text-gray-500">Chargement de l'éditeur...</div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`border border-gray-200 rounded-lg overflow-hidden bg-white ${className}`}
      >
        {/* Toolbar */}
        <div className="border-b border-gray-200 p-3 bg-gray-50">
          <div className="flex flex-wrap items-center gap-1">
            {/* Formatage du texte */}
            <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
              <ToolbarButton
                onClick={toggleBold}
                isActive={editor.isActive("bold")}
                icon={Bold}
                tooltip="Gras (Ctrl+B)"
              />
              <ToolbarButton
                onClick={toggleItalic}
                isActive={editor.isActive("italic")}
                icon={Italic}
                tooltip="Italique (Ctrl+I)"
              />
              <ToolbarButton
                onClick={toggleStrike}
                isActive={editor.isActive("strike")}
                icon={Strikethrough}
                tooltip="Barré"
              />
              <ToolbarButton
                onClick={toggleCode}
                isActive={editor.isActive("code")}
                icon={Code}
                tooltip="Code inline"
              />
            </div>

            {/* Titres */}
            <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
              <ToolbarButton
                onClick={toggleHeading1}
                isActive={editor.isActive("heading", { level: 1 })}
                icon={Heading1}
                tooltip="Titre 1"
              />
              <ToolbarButton
                onClick={toggleHeading2}
                isActive={editor.isActive("heading", { level: 2 })}
                icon={Heading2}
                tooltip="Titre 2"
              />
              <ToolbarButton
                onClick={toggleHeading3}
                isActive={editor.isActive("heading", { level: 3 })}
                icon={Heading3}
                tooltip="Titre 3"
              />
            </div>

            {/* Listes */}
            <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
              <ToolbarButton
                onClick={toggleBulletList}
                isActive={editor.isActive("bulletList")}
                icon={List}
                tooltip="Liste à puces"
              />
              <ToolbarButton
                onClick={toggleOrderedList}
                isActive={editor.isActive("orderedList")}
                icon={ListOrdered}
                tooltip="Liste numérotée"
              />
              <ToolbarButton
                onClick={toggleBlockquote}
                isActive={editor.isActive("blockquote")}
                icon={Quote}
                tooltip="Citation"
              />
            </div>

            {/* Liens et médias */}
            <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
              <ToolbarButton
                onClick={addLink}
                isActive={editor.isActive("link")}
                icon={LinkIcon}
                tooltip="Ajouter un lien"
              />
              <ToolbarButton
                onClick={handleImageButtonClick}
                isActive={false}
                icon={ImageIcon}
                tooltip="Ajouter une image"
              />
            </div>

            {/* Undo/Redo */}
            <div className="flex items-center">
              <ToolbarButton
                onClick={undo}
                isActive={false}
                icon={Undo}
                tooltip="Annuler (Ctrl+Z)"
                disabled={!editor.can().undo()}
              />
              <ToolbarButton
                onClick={redo}
                isActive={false}
                icon={Redo}
                tooltip="Refaire (Ctrl+Y)"
                disabled={!editor.can().redo()}
              />
            </div>
          </div>
        </div>

        {/* Éditeur avec styles Tiptap */}
        <div className="relative">
          <EditorContent
            editor={editor}
            className="min-h-[400px] max-h-[600px] overflow-y-auto tiptap-editor"
          />
        </div>

        {/* Compteur de caractères */}
        <div className="border-t border-gray-200 px-4 py-2 bg-gray-50 text-right">
          <span className="text-sm text-gray-500">
            {editor.storage.characterCount?.characters() || 0} caractères
          </span>
        </div>
      </div>

      {/* Modal pour les liens */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md">
            <h3 className="text-lg font-semibold mb-4 font-poppins">
              Ajouter un lien
            </h3>
            <input
              type="url"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              autoFocus
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annuler
              </button>
              <button
                onClick={handleLinkSubmit}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styles CSS pour Tiptap */}
      <style jsx global>{`
        .tiptap-editor .ProseMirror {
          outline: none;
        }

        .tiptap-editor .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }

        .tiptap-editor .ProseMirror strong {
          font-weight: 700;
        }

        .tiptap-editor .ProseMirror em {
          font-style: italic;
        }

        .tiptap-editor .ProseMirror code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-family: "JetBrains Mono", "Courier New", monospace;
          font-size: 0.875rem;
        }

        .tiptap-editor .ProseMirror h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .tiptap-editor .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }

        .tiptap-editor .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }

        .tiptap-editor .ProseMirror blockquote {
          border-left: 4px solid #d1d5db;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #6b7280;
        }

        .tiptap-editor .ProseMirror ul,
        .tiptap-editor .ProseMirror ol {
          padding-left: 1.5rem;
          margin: 1rem 0;
        }

        .tiptap-editor .ProseMirror ul {
          list-style-type: disc;
        }

        .tiptap-editor .ProseMirror ol {
          list-style-type: decimal;
        }

        .tiptap-editor .ProseMirror li {
          margin-bottom: 0.25rem;
        }

        .tiptap-editor .ProseMirror a {
          color: #0d9488;
          text-decoration: underline;
        }

        .tiptap-editor .ProseMirror a:hover {
          color: #0f766e;
        }

        .tiptap-editor .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </>
  );
}

// Composant pour les boutons de la toolbar
function ToolbarButton({
  onClick,
  isActive,
  icon: Icon,
  tooltip,
  disabled = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded hover:bg-gray-200 transition-colors ${
        isActive
          ? "bg-teal-100 text-teal-700"
          : "text-gray-600 hover:text-gray-900"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      title={tooltip}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
