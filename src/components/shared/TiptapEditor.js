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
          class: "w-full h-96 object-cover rounded-lg my-6 shadow-sm",
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
        class: "prose prose-lg max-w-none focus:outline-none min-h-[400px] px-4 py-3",
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer?.files?.[0]?.type.startsWith("image/")) {
          event.preventDefault();
          handleImageUpload(event.dataTransfer.files[0], view, event);
          return true;
        }
        return false;
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const handleImageUpload = useCallback(
    async (file, view, event) => {
      if (!onImageUpload) return;

      try {
        const imageData = await onImageUpload(file);
        if (imageData?.fileUrl) {
          const imageNode = {
            src: imageData.fileUrl,
            alt: imageData.originalName || "Image",
            title: imageData.originalName || "Image",
          };

          if (view && event) {
            const coords = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            });
            coords?.pos && view.dispatch(
              view.state.tr.replaceWith(
                coords.pos,
                coords.pos,
                view.state.schema.nodes.image.create(imageNode)
              )
            );
          } else {
            editor?.chain().focus().setImage(imageNode).run();
          }
        }
      } catch (error) {
        console.error("Erreur lors de l'upload d'image:", error);
      }
    },
    [onImageUpload, editor]
  );

  const handleImageButtonClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      file && await handleImageUpload(file);
    };
    input.click();
  };

  // Fonctions de la toolbar
  const toggleBold = () => editor?.chain().focus().toggleBold().run();
  const toggleItalic = () => editor?.chain().focus().toggleItalic().run();
  const toggleStrike = () => editor?.chain().focus().toggleStrike().run();
  const toggleCode = () => editor?.chain().focus().toggleCode().run();
  const toggleHeading1 = () => editor?.chain().focus().toggleHeading({ level: 1 }).run();
  const toggleHeading2 = () => editor?.chain().focus().toggleHeading({ level: 2 }).run();
  const toggleHeading3 = () => editor?.chain().focus().toggleHeading({ level: 3 }).run();
  const toggleBulletList = () => editor?.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor?.chain().focus().toggleOrderedList().run();
  const toggleBlockquote = () => editor?.chain().focus().toggleBlockquote().run();
  const undo = () => editor?.chain().focus().undo().run();
  const redo = () => editor?.chain().focus().redo().run();

  const addLink = () => {
    setLinkUrl("");
    setShowLinkModal(true);
  };

  const handleLinkSubmit = () => {
    linkUrl && editor?.chain().focus().setLink({ href: linkUrl }).run();
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
      <div className={`border border-gray-200 rounded-lg overflow-hidden bg-white ${className}`}>
        {/* Toolbar */}
        <div className="border-b border-gray-200 p-3 bg-gray-50">
          <div className="flex flex-wrap items-center gap-1">
            {/* Formatage */}
            <ToolbarGroup>
              <ToolbarButton
                onClick={toggleBold}
                active={editor.isActive("bold")}
                icon={Bold}
                tooltip="Gras (Ctrl+B)"
              />
              <ToolbarButton
                onClick={toggleItalic}
                active={editor.isActive("italic")}
                icon={Italic}
                tooltip="Italique (Ctrl+I)"
              />
              <ToolbarButton
                onClick={toggleStrike}
                active={editor.isActive("strike")}
                icon={Strikethrough}
                tooltip="Barré"
              />
              <ToolbarButton
                onClick={toggleCode}
                active={editor.isActive("code")}
                icon={Code}
                tooltip="Code inline"
              />
            </ToolbarGroup>

            {/* Titres */}
            <ToolbarGroup>
              <ToolbarButton
                onClick={toggleHeading1}
                active={editor.isActive("heading", { level: 1 })}
                icon={Heading1}
                tooltip="Titre 1"
              />
              <ToolbarButton
                onClick={toggleHeading2}
                active={editor.isActive("heading", { level: 2 })}
                icon={Heading2}
                tooltip="Titre 2"
              />
              <ToolbarButton
                onClick={toggleHeading3}
                active={editor.isActive("heading", { level: 3 })}
                icon={Heading3}
                tooltip="Titre 3"
              />
            </ToolbarGroup>

            {/* Listes */}
            <ToolbarGroup>
              <ToolbarButton
                onClick={toggleBulletList}
                active={editor.isActive("bulletList")}
                icon={List}
                tooltip="Liste à puces"
              />
              <ToolbarButton
                onClick={toggleOrderedList}
                active={editor.isActive("orderedList")}
                icon={ListOrdered}
                tooltip="Liste numérotée"
              />
              <ToolbarButton
                onClick={toggleBlockquote}
                active={editor.isActive("blockquote")}
                icon={Quote}
                tooltip="Citation"
              />
            </ToolbarGroup>

            {/* Liens et médias */}
            <ToolbarGroup>
              <ToolbarButton
                onClick={addLink}
                active={editor.isActive("link")}
                icon={LinkIcon}
                tooltip="Ajouter un lien"
              />
              <ToolbarButton
                onClick={handleImageButtonClick}
                icon={ImageIcon}
                tooltip="Ajouter une image"
              />
            </ToolbarGroup>

            {/* Undo/Redo */}
            <ToolbarGroup>
              <ToolbarButton
                onClick={undo}
                disabled={!editor.can().undo()}
                icon={Undo}
                tooltip="Annuler (Ctrl+Z)"
              />
              <ToolbarButton
                onClick={redo}
                disabled={!editor.can().redo()}
                icon={Redo}
                tooltip="Refaire (Ctrl+Y)"
              />
            </ToolbarGroup>
          </div>
        </div>

        {/* Éditeur */}
        <div className="relative">
          <EditorContent
            editor={editor}
            className="min-h-[400px] max-h-[600px] overflow-y-auto tiptap-editor"
          />
        </div>

        {/* Compteur */}
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
            <h3 className="text-lg font-semibold mb-4">Ajouter un lien</h3>
            <input
              type="url"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 mb-4"
              autoFocus
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleLinkSubmit}
                className="px-4 py-2 bg-teal-600 text-white hover:bg-teal-700 rounded-lg transition-colors"
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

        .tiptap-editor .ProseMirror {
          h1 { @apply text-3xl font-bold my-4; }
          h2 { @apply text-2xl font-bold my-3; }
          h3 { @apply text-xl font-bold my-2; }
          strong { @apply font-bold; }
          em { @apply italic; }
          code { @apply bg-gray-100 px-1 rounded font-mono text-sm; }
          blockquote { @apply border-l-4 border-gray-300 pl-4 my-2 italic text-gray-600; }
          ul { @apply list-disc pl-6 my-2; }
          ol { @apply list-decimal pl-6 my-2; }
          li { @apply mb-1; }
          a { @apply text-teal-600 hover:text-teal-700 underline; }
          img { @apply w-full h-96 object-cover rounded-lg my-6 shadow-sm; }
        }
      `}</style>
    </>
  );
}

// Composants helper avec des boutons HTML natifs au lieu du composant Button
function ToolbarGroup({ children }) {
  return (
    <div className="flex items-center border-r border-gray-300 pr-2 mr-2 last:border-r-0 last:pr-0 last:mr-0">
      {children}
    </div>
  );
}

function ToolbarButton({ onClick, active, icon: Icon, tooltip, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      className={`
        p-2 rounded-lg transition-colors
        ${active
          ? 'bg-teal-600 text-white'
          : 'text-gray-700 hover:bg-gray-200'
        }
        ${disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'cursor-pointer'
        }
      `}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}