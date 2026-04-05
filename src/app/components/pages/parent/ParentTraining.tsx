import { BookOpen, Phone, Mail, Users, ArrowRight } from "lucide-react";
import { Button } from "../../ui/button";

export function ParentTraining() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white rounded-3xl shadow-lg border border-green-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-blue-600 px-6 py-8 text-white">
          <p className="text-sm uppercase tracking-wide text-white/80">Formation parents</p>
          <h1 className="text-3xl font-bold mt-2">Formation pour les parents</h1>
          <p className="mt-3 text-white/90 max-w-2xl">
            Une formation pratique pour aider les parents à mieux accompagner le développement,
            l’autonomie et la gestion comportementale au quotidien.
          </p>
        </div>

        <div className="p-6 grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">Programme de la formation</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
                <p><span className="font-semibold">Date :</span> Lundi 21 avril 2026</p>
                <p><span className="font-semibold">Heure :</span> 18:00 - 20:00</p>
                <p><span className="font-semibold">Mode :</span> En ligne + accompagnement</p>
                <p><span className="font-semibold">Durée :</span> 4 semaines</p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Objectifs</h2>
              <ul className="space-y-2 text-gray-700 list-disc pl-5">
                <li>Comprendre les besoins de l’enfant dans les routines quotidiennes.</li>
                <li>Apprendre des techniques de communication positive.</li>
                <li>Renforcer l’autonomie avec des exercices simples à la maison.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact</h2>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <Users className="w-4 h-4 mt-0.5 text-green-500" />
                  <span>Équipe formation parents AutiCare</span>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 mt-0.5 text-green-500" />
                  <span>+216 71 234 890</span>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 mt-0.5 text-green-500" />
                  <span>formation@auticare.tn</span>
                </div>
              </div>
            </div>

            <Button className="w-full h-12 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl shadow-md">
              S’inscrire maintenant
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
