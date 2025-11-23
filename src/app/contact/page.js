/**
 * Contact page component.
 * Provides a contact form for users to send messages to site administrators.
 * Includes contact information display and form submission handling.
 */
"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Image from "next/image";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { useToast } from "@/context/ToastProvider";
import { useSettings } from "@/hooks/useSettings";

export default function ContactPage() {
  const { showToast } = useToast();
  const { settings } = useSettings();
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

  function ImageCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const images = [
      "/person.png",
      "/person1.png",
      "/person2.png",
      "/person3.png",
      "/person4.png"

    ];

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 3000);

      return () => clearInterval(interval);
    }, [images.length]);

    return (
      <div className="relative h-full w-full">
        {images.map((src, index) => (
          <Image
            key={index}
            fill
            src={src}
            alt={`Image ${index + 1}`}
            style={{ objectFit: 'cover' }}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="py-7">
        <div className="container">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="card p-8">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="h3-title text-gray-900 mb-2">
                    Message envoyé !
                  </h3>
                  <p className="body-text text-gray-600 mb-6">
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

                  <p className="h4-title text-gray-600 max-w-2xl mb-4 mx-auto">
                    Une question, une suggestion ou envie de collaborer ? Nous serions
                    ravis d'échanger avec vous !
                  </p>
                  <h2 className="h2-title text-gray-900 mb-6">
                    Envoyez-nous un message
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="h6-title block mb-2">Nom complet</label>
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
                        <label className="h6-title block mb-2">Adresse e-mail</label>
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
                      <label className="h6-title block mb-2">Sujet</label>
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
                      <label className="h6-title block mb-2">Message</label>
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

            <div className="space-y-6">
              <div className="card overflow-hidden h-full">
                <ImageCarousel />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}