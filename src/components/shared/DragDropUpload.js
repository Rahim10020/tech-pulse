// components/shared/DragDropUpload.js - Composant de drag & drop avancé
"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import {
  Upload,
  Image as ImageIcon,
  Video,
  File,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Play,
  Pause,
} from "lucide-react";

const ACCEPTED_TYPES = {
  "image/jpeg": { category: "image", icon: ImageIcon },
  "image/jpg": { category: "image", icon: ImageIcon },
  "image/png": { category: "image", icon: ImageIcon },
  "image/webp": { category: "image", icon: ImageIcon },
  "image/gif": { category: "gif", icon: ImageIcon },
  "video/mp4": { category: "video", icon: Video },
  "video/webm": { category: "video", icon: Video },
  "video/ogg": { category: "video", icon: Video },
  "video/quicktime": { category: "video", icon: Video },
};

export default function DragDropUpload({
  onFilesUploaded,
  onError,
  textareaRef,
  className = "",
  maxFiles = 5,
  showPreview = true,
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Valider un fichier
  const validateFile = useCallback((file) => {
    const typeInfo = ACCEPTED_TYPES[file.type];
    if (!typeInfo) {
      return {
        valid: false,
        error: `Type de fichier non supporté: ${file.type}`,
      };
    }

    const maxSizes = {
      image: 5 * 1024 * 1024, // 5MB
      gif: 10 * 1024 * 1024, // 10MB
      video: 50 * 1024 * 1024, // 50MB
    };

    const maxSize = maxSizes[typeInfo.category];
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      return {
        valid: false,
        error: `Fichier trop volumineux. Maximum: ${maxSizeMB}MB`,
      };
    }

    return { valid: true };
  }, []);

  // Traiter les fichiers sélectionnés
  const processFiles = useCallback(
    (files) => {
      const fileArray = Array.from(files);

      if (fileArray.length > maxFiles) {
        onError?.(`Maximum ${maxFiles} fichiers autorisés`);
        return;
      }

      const validFiles = [];
      const errors = [];

      fileArray.forEach((file, index) => {
        const validation = validateFile(file);
        if (validation.valid) {
          validFiles.push({
            id: `${Date.now()}_${index}`,
            file,
            preview: null,
            status: "pending",
            progress: 0,
            error: null,
          });
        } else {
          errors.push(`${file.name}: ${validation.error}`);
        }
      });

      if (errors.length > 0) {
        onError?.(errors.join("\n"));
      }

      if (validFiles.length > 0) {
        setUploadQueue((prev) => [...prev, ...validFiles]);
        generatePreviews(validFiles);
        uploadFiles(validFiles);
      }
    },
    [maxFiles, validateFile, onError, generatePreviews, uploadFiles]
  );

  // Générer les aperçus
  const generatePreviews = useCallback((files) => {
    files.forEach((fileItem) => {
      if (fileItem.file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadQueue((prev) =>
            prev.map((item) =>
              item.id === fileItem.id
                ? { ...item, preview: e.target.result }
                : item
            )
          );
        };
        reader.readAsDataURL(fileItem.file);
      }
    });
  }, []);

  // Upload des fichiers
  const uploadFiles = useCallback(
    async (files) => {
      setIsUploading(true);

      for (const fileItem of files) {
        try {
          // Mettre à jour le statut
          setUploadQueue((prev) =>
            prev.map((item) =>
              item.id === fileItem.id ? { ...item, status: "uploading" } : item
            )
          );

          const formData = new FormData();
          formData.append("file", fileItem.file);

          const response = await fetch("/api/upload", {
            method: "POST",
            credentials: "include",
            body: formData,
          });

          const data = await response.json();

          if (data.success) {
            // Succès
            setUploadQueue((prev) =>
              prev.map((item) =>
                item.id === fileItem.id
                  ? {
                    ...item,
                    status: "success",
                    progress: 100,
                    uploadData: data,
                  }
                  : item
              )
            );

            // Insérer dans le textarea
            insertMediaIntoTextarea(data, fileItem.file);

            // Callback de succès
            onFilesUploaded?.([
              {
                ...data,
                originalFile: fileItem.file,
              },
            ]);
          } else {
            throw new Error(data.error);
          }
        } catch (error) {
          console.error("Upload error:", error);
          setUploadQueue((prev) =>
            prev.map((item) =>
              item.id === fileItem.id
                ? { ...item, status: "error", error: error.message }
                : item
            )
          );
          onError?.(error.message);
        }
      }

      setIsUploading(false);
    },
    [onFilesUploaded, onError, insertMediaIntoTextarea]
  );

  // Insérer le média dans le textarea
  const insertMediaIntoTextarea = useCallback(
    (uploadData, file) => {
      if (!textareaRef?.current) return;

      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      let markdownText = "";

      if (uploadData.mediaCategory === "videos") {
        markdownText = `\n<video controls width="100%" style="max-width: 600px;">\n  <source src="${uploadData.fileUrl}" type="${file.type}">\n  Votre navigateur ne supporte pas la lecture de vidéos.\n</video>\n\n`;
      } else {
        markdownText = `\n![${file.name}](${uploadData.fileUrl})\n\n`;
      }

      const newContent =
        textarea.value.substring(0, start) +
        markdownText +
        textarea.value.substring(end);

      // Mettre à jour la valeur
      textarea.value = newContent;

      // Déclencher les événements nécessaires pour React
      const inputEvent = new Event("input", { bubbles: true });
      const changeEvent = new Event("change", { bubbles: true });

      textarea.dispatchEvent(inputEvent);
      textarea.dispatchEvent(changeEvent);

      // Repositionner le curseur
      setTimeout(() => {
        textarea.focus();
        const newPosition = start + markdownText.length;
        textarea.setSelectionRange(newPosition, newPosition);
      }, 0);
    },
    [textareaRef]
  );

  // Gestionnaires d'événements de drag
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        processFiles(files);
      }
    },
    [processFiles]
  );

  // Supprimer un fichier de la queue
  const removeFromQueue = useCallback((fileId) => {
    setUploadQueue((prev) => prev.filter((item) => item.id !== fileId));
  }, []);

  // Ouvrir le sélecteur de fichiers
  const openFileSelector = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Zone de drop overlay */}
      {isDragOver && (
        <div
          className="fixed inset-0 bg-teal-500 bg-opacity-20 backdrop-blur-sm z-50 flex items-center justify-center"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="bg-white rounded-xl shadow-2xl p-8 border-2 border-dashed border-teal-500 text-center max-w-md">
            <Upload className="w-16 h-16 text-teal-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-poppins">
              Déposez vos fichiers ici
            </h3>
            <p className="text-gray-600 font-sans">
              Images, GIFs et vidéos supportés
            </p>
          </div>
        </div>
      )}

      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={Object.keys(ACCEPTED_TYPES).join(",")}
        onChange={(e) => processFiles(e.target.files)}
        className="hidden"
      />

      {/* Queue d'upload */}
      {uploadQueue.length > 0 && showPreview && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700 font-poppins">
              Fichiers en cours d&apos;upload
            </h4>
            {isUploading && (
              <div className="flex items-center space-x-2 text-sm text-teal-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="font-sans">Upload en cours...</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {uploadQueue.map((item) => (
              <FileUploadItem
                key={item.id}
                item={item}
                onRemove={() => removeFromQueue(item.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Bouton d'upload */}
      <button
        type="button"
        onClick={openFileSelector}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        disabled={isUploading}
        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="text-center">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-600 font-poppins">
            Cliquez pour sélectionner ou glissez-déposez
          </p>
          <p className="text-xs text-gray-500 mt-1 font-sans">
            Images (5MB), GIFs (10MB), Vidéos (50MB)
          </p>
        </div>
      </button>
    </div>
  );
}

// Composant pour afficher un fichier dans la queue
function FileUploadItem({ item, onRemove }) {
  const typeInfo = ACCEPTED_TYPES[item.file.type];
  const Icon = typeInfo?.icon || File;
  const fileSizeMB = (item.file.size / (1024 * 1024)).toFixed(2);

  const getStatusIcon = () => {
    switch (item.status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "uploading":
        return <Loader2 className="w-4 h-4 text-teal-500 animate-spin" />;
      default:
        return <Icon className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
      {/* Aperçu ou icône */}
      <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        {item.preview ? (
          <Image
            src={item.preview}
            alt={item.file.name}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        ) : (
          <Icon className="w-6 h-6 text-gray-400" />
        )}
      </div>

      {/* Informations du fichier */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate font-poppins">
          {item.file.name}
        </p>
        <p className="text-xs text-gray-500 font-sans">
          {fileSizeMB} MB • {typeInfo?.category}
        </p>
        {item.error && (
          <p className="text-xs text-red-600 mt-1 font-sans">{item.error}</p>
        )}
      </div>

      {/* Statut */}
      <div className="flex items-center space-x-2">
        {getStatusIcon()}
        {item.status !== "error" && (
          <button
            onClick={onRemove}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
