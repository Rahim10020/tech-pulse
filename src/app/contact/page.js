// src/app/contact/page.js - Page Contact (bonus)
"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { useToast } from "@/context/ToastProvider";

export default function ContactPage() {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        showToast('Message envoyé avec succès !', 'success');
        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: ""
        });
      } else {
        showToast(result.error || 'Erreur lors de l\'envoi', 'error');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      showToast('Erreur lors de l\'envoi du message', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="py-7">
        <div className="container max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-poppins font-bold text-gray-900 mb-6">
              Contactez-nous
            </h1>
            <p className="text-xl font-poppins text-gray-600 max-w-2xl mx-auto">
              Une question, une suggestion ou envie de collaborer ? Nous serions
              ravis d'échanger avec vous !
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="card p-8">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-poppins font-bold text-gray-900 mb-2">
                    Message envoyé !
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="btn-secondary"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-6">
                    Envoyez-nous un message
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="label">Nom complet</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="Votre nom"
                          required
                        />
                      </div>
                      <div>
                        <label className="label">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="votre@email.com"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="label">Sujet</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Sujet de votre message"
                        required
                      />
                    </div>
                    <div>
                      <label className="label">Message</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="6"
                        className="input-field resize-none"
                        placeholder="Votre message..."
                        required
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full flex items-center justify-center disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Envoyer le message
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="card p-8">
                <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-6">
                  Informations de contact
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Mail className="w-6 h-6 text-teal-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <p className="text-gray-600">contact@techpulse.com</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Phone className="w-6 h-6 text-teal-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Téléphone</h3>
                      <p className="text-gray-600">+33 1 23 45 67 89</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 text-teal-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Adresse</h3>
                      <p className="text-gray-600">
                        123 Rue de la Tech
                        <br />
                        75001 Paris, France
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-8">
                <h3 className="text-xl font-poppins font-bold text-gray-900 mb-4">
                  Temps de réponse
                </h3>
                <p className="text-gray-600 mb-4">
                  Nous nous efforçons de répondre à tous les messages dans les
                  24 heures ouvrables.
                </p>
                <div className="text-sm text-gray-500">
                  <p>
                    <strong>Lun - Ven:</strong> 9h00 - 18h00
                  </p>
                  <p>
                    <strong>Sam - Dim:</strong> Fermé
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
