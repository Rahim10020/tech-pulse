// hooks/useAutoSave.js - Hook pour la sauvegarde automatique
import { useEffect, useRef, useCallback } from "react";
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
  const lastSavedRef = useRef(null);
  const isSavingRef = useRef(false);

  // Fonction de sauvegarde avec debounce
  const debouncedSave = useCallback(
    async (data) => {
      // Annuler la sauvegarde précédente si elle est en cours
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Programmer une nouvelle sauvegarde
      timeoutRef.current = setTimeout(async () => {
        // Vérifier si les données ont changé depuis la dernière sauvegarde
        const currentDataString = JSON.stringify(data);
        if (currentDataString === lastSavedRef.current || isSavingRef.current) {
          return;
        }

        // Vérifier les conditions minimales
        if (!data.title?.trim() || data.content?.length < minLength) {
          return;
        }

        try {
          isSavingRef.current = true;

          if (onSave) {
            await onSave(data);
            lastSavedRef.current = currentDataString;
          }
        } catch (err) {
          console.error("Auto-save failed:", err);
          if (onError) {
            onError(err);
          } else {
            error("Erreur lors de la sauvegarde automatique");
          }
        } finally {
          isSavingRef.current = false;
        }
      }, delay);
    },
    [delay, minLength, onSave, onError, error]
  );

  // Déclencher la sauvegarde quand les données changent
  useEffect(() => {
    if (!enabled) return;

    debouncedSave(formData);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [formData, enabled, debouncedSave]);

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

    if (!formData.title?.trim() || formData.content?.length < minLength) {
      return false;
    }

    try {
      isSavingRef.current = true;
      if (onSave) {
        await onSave(formData);
        lastSavedRef.current = JSON.stringify(formData);
        return true;
      }
    } catch (err) {
      console.error("Force save failed:", err);
      if (onError) {
        onError(err);
      }
      return false;
    } finally {
      isSavingRef.current = false;
    }
  }, [formData, minLength, onSave, onError]);

  return {
    isSaving: isSavingRef.current,
    forceSave,
    lastSaved: lastSavedRef.current ? new Date() : null,
  };
}
