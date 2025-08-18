// hooks/useAutoSave.js - Version corrigée avec meilleure logique
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
  const isInitialMount = useRef(true);

  // Fonction de comparaison pour détecter les changements réels
  const hasDataChanged = useCallback((newData) => {
    if (!lastSavedDataRef.current) return true;

    // Comparer les champs importants seulement
    const oldData = lastSavedDataRef.current;
    return (
      oldData.title?.trim() !== newData.title?.trim() ||
      oldData.content?.trim() !== newData.content?.trim() ||
      oldData.description?.trim() !== newData.description?.trim() ||
      oldData.category !== newData.category
    );
  }, []);

  // Fonction de validation des données avant sauvegarde
  const shouldSave = useCallback((data) => {
    // Au moins un titre ou du contenu doit être présent
    const hasContent = data.title?.trim() || data.content?.trim();
    if (!hasContent) return false;

    // Vérifier la longueur minimale du contenu si présent
    if (data.content && data.content.replace(/<[^>]*>/g, '').length < minLength) {
      return false;
    }

    // Vérifier si les données ont vraiment changé
    if (!hasDataChanged(data)) {
      return false;
    }

    return true;
  }, [minLength, hasDataChanged]);

  // Fonction de sauvegarde avec gestion d'état améliorée
  const performSave = useCallback(async (data) => {
    // Vérifier si on doit sauvegarder
    if (!shouldSave(data)) {
      return false;
    }

    // Éviter les sauvegardes multiples simultanées
    if (isSaving) {
      return false;
    }

    try {
      setIsSaving(true);

      if (onSave) {
        const result = await onSave(data);

        // Mettre à jour la référence seulement en cas de succès
        if (result && result.success) {
          lastSavedDataRef.current = {
            title: data.title,
            content: data.content,
            description: data.description,
            category: data.category
          };
          lastSavedTimeRef.current = new Date();
        }

        return result;
      }

      return false;
    } catch (err) {
      console.error("Auto-save failed:", err);
      if (onError) {
        onError(err);
      } else {
        // N'afficher l'erreur que si ce n'est pas le premier échec
        if (!isInitialMount.current) {
          error("Erreur lors de la sauvegarde automatique");
        }
      }
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [shouldSave, isSaving, onSave, onError, error]);

  // Fonction de sauvegarde avec debounce
  const debouncedSave = useCallback(
    (data) => {
      // Annuler la sauvegarde précédente
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Programmer une nouvelle sauvegarde
      timeoutRef.current = setTimeout(() => {
        if (!isSaving && enabled) {
          performSave(data);
        }
      }, delay);
    },
    [delay, performSave, isSaving, enabled]
  );

  // Déclencher la sauvegarde quand les données changent
  useEffect(() => {
    // Ignorer le premier rendu
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

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
    // Annuler la sauvegarde programmée
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Effectuer la sauvegarde immédiatement
    return await performSave(formData);
  }, [formData, performSave]);

  return {
    isSaving,
    forceSave,
    lastSaved: lastSavedTimeRef.current,
  };
}