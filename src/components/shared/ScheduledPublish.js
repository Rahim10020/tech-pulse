"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ScheduledPublish({
  onSchedule,
  onCancel,
  isVisible = false,
  defaultDate = null,
  defaultTime = null,
}) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [timezone, setTimezone] = useState("");
  const [isValidDateTime, setIsValidDateTime] = useState(false);

  // Initialiser avec la timezone locale
  useEffect(() => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(userTimezone);

    if (defaultDate) setSelectedDate(defaultDate);
    if (defaultTime) setSelectedTime(defaultTime);
  }, [defaultDate, defaultTime]);

  // Valider la date et l'heure
  useEffect(() => {
    if (selectedDate && selectedTime) {
      const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}`);
      const now = new Date();
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

      setIsValidDateTime(
        scheduledDateTime > now && scheduledDateTime <= oneYearFromNow
      );
    } else {
      setIsValidDateTime(false);
    }
  }, [selectedDate, selectedTime]);

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const getMaxDate = () => {
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    return oneYearFromNow.toISOString().split("T")[0];
  };

  const getMinTime = () => {
    const today = new Date().toISOString().split("T")[0];
    if (selectedDate === today) {
      const now = new Date();
      now.setHours(now.getHours() + 1);
      return now.toTimeString().slice(0, 5);
    }
    return "00:00";
  };

  const handleSchedule = () => {
    if (!isValidDateTime) return;

    const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}`);

    onSchedule?.({
      scheduledAt: scheduledDateTime.toISOString(),
      scheduledAtFormatted: scheduledDateTime.toLocaleString("fr-FR", {
        timeZone: timezone,
        dateStyle: "full",
        timeStyle: "short",
      }),
      timezone,
    });
  };

  const handleCancel = () => {
    setSelectedDate("");
    setSelectedTime("");
    onCancel?.();
  };

  const getScheduledPreview = () => {
    if (!selectedDate || !selectedTime) return null;

    const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const now = new Date();
    const diffMs = scheduledDateTime - now;

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    let timeUntil = "";
    if (diffDays > 0) {
      timeUntil = `dans ${diffDays} jour${diffDays > 1 ? "s" : ""}`;
    } else if (diffHours > 0) {
      timeUntil = `dans ${diffHours}h ${diffMinutes}min`;
    } else if (diffMinutes > 0) {
      timeUntil = `dans ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""}`;
    } else {
      timeUntil = "maintenant";
    }

    return {
      formatted: scheduledDateTime.toLocaleString("fr-FR", {
        timeZone: timezone,
        dateStyle: "full",
        timeStyle: "short",
      }),
      timeUntil,
      isValid: isValidDateTime,
    };
  };

  const preview = getScheduledPreview();

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-teal-600" />
            <h3 className="h4-title text-gray-900">
              Programmer la publication
            </h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Date Selection */}
          <div>
            <label className="h5-title text-gray-700 mb-2">
              Date de publication
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={getMinDate()}
                max={getMaxDate()}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Time Selection */}
          <div>
            <label className="h5-title text-gray-700 mb-2">
              Heure de publication
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                min={getMinTime()}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Timezone Info */}
          <div className="small-text text-gray-500 bg-gray-50 p-3 rounded-lg">
            <span className="font-medium">Fuseau horaire:</span> {timezone}
          </div>

          {/* Preview */}
          {preview && (
            <div
              className={`p-4 rounded-lg border ${
                preview.isValid
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-start space-x-2">
                {preview.isValid ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className={`h6-title ${preview.isValid ? "text-green-800" : "text-red-800"}`}>
                    {preview.isValid ? "Publication programmée" : "Date invalide"}
                  </p>
                  <p className={`small-text ${preview.isValid ? "text-green-700" : "text-red-700"}`}>
                    {preview.isValid ? (
                      <>
                        Le {preview.formatted}
                        <br />({preview.timeUntil})
                      </>
                    ) : (
                      "La date doit être dans le futur"
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={handleCancel}
          >
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleSchedule}
            disabled={!isValidDateTime}
          >
            Programmer
          </Button>
        </div>
      </div>
    </div>
  );
}