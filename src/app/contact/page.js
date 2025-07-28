// src/app/contact/page.js - Page Contact (bonus)
import Header from "@/components/layout/Header";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export const metadata = {
  title: "Contact - TechPulse",
  description:
    "Contactez l'équipe TechPulse pour vos questions, suggestions ou collaborations.",
};

export default function ContactPage() {
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

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="card p-8">
              <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-6">
                Envoyez-nous un message
              </h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Nom</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input
                      type="email"
                      className="input-field"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Sujet</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Sujet de votre message"
                  />
                </div>
                <div>
                  <label className="label">Message</label>
                  <textarea
                    rows="6"
                    className="input-field resize-none"
                    placeholder="Votre message..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="btn-primary w-full flex items-center justify-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer le message
                </button>
              </form>
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
