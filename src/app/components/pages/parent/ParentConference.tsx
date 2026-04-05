import { CalendarDays, MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { Button } from "../../ui/button";

export function ParentConference() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white rounded-3xl shadow-lg border border-blue-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-green-500 px-6 py-8 text-white">
          <p className="text-sm uppercase tracking-wide text-white/80">Conférence</p>
          <h1 className="text-3xl font-bold mt-2">Comprendre et accompagner son enfant</h1>
          <p className="mt-3 text-white/90 max-w-2xl">
            Une conférence dédiée aux parents pour découvrir des stratégies concrètes d’accompagnement,
            de communication et d’organisation du quotidien.
          </p>
        </div>

        <div className="p-6 grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
              <div className="flex items-center gap-3 mb-3">
                <CalendarDays className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Détails de l’événement</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
                <p><span className="font-semibold">Date :</span> Samedi 19 avril 2026</p>
                <p><span className="font-semibold">Heure :</span> 09:30 - 12:30</p>
                <p><span className="font-semibold">Lieu :</span> Centre AutiCare, Tunis</p>
                <p><span className="font-semibold">Format :</span> Présentiel + streaming</p>
              </div>
            </div>

            <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Ce que vous allez découvrir</h2>
              <ul className="space-y-2 text-gray-700 list-disc pl-5">
                <li>Des outils simples pour mieux communiquer avec votre enfant.</li>
                <li>Des conseils pour gérer les routines et les transitions.</li>
                <li>Des exemples pratiques de soutien à la maison et à l’école.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact</h2>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 text-blue-500" />
                  <span>Centre AutiCare, Avenue Habib Bourguiba, Tunis</span>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 mt-0.5 text-blue-500" />
                  <span>+216 71 234 567</span>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 mt-0.5 text-blue-500" />
                  <span>conference@auticare.tn</span>
                </div>
              </div>
            </div>

            <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-green-500 text-white rounded-xl shadow-md">
              Réserver une place
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
