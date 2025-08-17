// hooks/useAutoSave.js - Version corrigée avec meilleure gestion des états
import { useEffect, useRef, useCallback, useState } from "react";
import { useToast } from "@/context/ToastProvider";

export function useAutoSave(formData, options = {}) {
  const {
    delay = 30000, // 30 secondes par défaut
    minLength = 10, // minimum de caractères pour déclencher la sauvegarde
    enabled = true,
    onSave,
    onError,
  } = options;

  const { error } = useToast();
  const timeoutRef = useRef(null);
  const lastSavedDataRef = useRef(null);
  const lastSavedTimeRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fonction de comparaison pour détecter les changements réels
  const hasDataChanged = useCallback((newData) => {
    if (!lastSavedDataRef.current) return true;

    // Comparer les champs importants seulement
    const oldData = lastSavedDataRef.current;
    return (
      oldData.title !== newData.title ||
      oldData.content !== newData.content ||
      oldData.description !== newData.description ||
      oldData.category !== newData.category
    );
  }, []);

  // Fonction de sauvegarde avec gestion d'état améliorée
  const performSave = useCallback(async (data) => {
    // Vérifier les conditions minimales
    if (!data.title?.trim() && !data.content?.trim()) {
      return false;
    }

    if (data.content && data.content.length < minLength) {
      return false;
    }

    // Vérifier si les données ont vraiment changé
    if (!hasDataChanged(data)) {
      return false;
    }

    try {
      setIsSaving(true);

      if (onSave) {
        const result = await onSave(data);

        // Mettre à jour la référence seulement en cas de succès
        lastSavedDataRef.current = { ...data };
        lastSavedTimeRef.current = new Date();

        return result;
      }

      return false;
    } catch (err) {
      console.error("Auto-save failed:", err);
      if (onError) {
        onError(err);
      } else {
        error("Erreur lors de la sauvegarde automatique");
      }
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [minLength, hasDataChanged, onSave, onError, error]);

  // Fonction de sauvegarde avec debounce
  const debouncedSave = useCallback(
    (data) => {
      // Annuler la sauvegarde précédente
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Programmer une nouvelle sauvegarde
      timeoutRef.current = setTimeout(() => {
        if (!isSaving) {
          performSave(data);
        }
      }, delay);
    },
    [delay, performSave, isSaving]
  );

  // Déclencher la sauvegarde quand les données changent
  useEffect(() => {
    if (!enabled || isSaving) return;

    // Vérifier si il y a du contenu à sauvegarder
    const hasContent = formData.title?.trim() || formData.content?.trim();
    if (!hasContent) return;

    // Déclencher la sauvegarde avec debounce
    debouncedSave(formData);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [formData, enabled, debouncedSave, isSaving]);

  // Cleanup au démontage
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Fonction pour forcer une sauvegarde immédiate
  const forceSave = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    return await performSave(formData);
  }, [formData, performSave]);

  return {
    isSaving,
    forceSave,
    lastSaved: lastSavedTimeRef.current,
  };
}