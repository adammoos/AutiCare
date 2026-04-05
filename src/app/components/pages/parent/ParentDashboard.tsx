import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Calendar, Gamepad2, Users, TrendingUp, Sparkles, Heart, FileText, Clock, CheckCircle2 } from "lucide-react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { getStoredActivities, getStoredEmotionEntries, getStoredTherapyRequests, THERAPY_REQUESTS_UPDATED_EVENT } from "../../../lib/mockData";

export function ParentDashboard() {
  const [activities, setActivities] = useState(getStoredActivities());
  const [latestEmotion, setLatestEmotion] = useState(() => {
    const entries = getStoredEmotionEntries();
    return entries[entries.length - 1]?.emotion ?? 'happy';
  });
  const [therapyRequests, setTherapyRequests] = useState(getStoredTherapyRequests());

  useEffect(() => {
    const refreshActivities = () => {
      setActivities(getStoredActivities());
    };

    const refreshEmotions = () => {
      const entries = getStoredEmotionEntries();
      setLatestEmotion(entries[entries.length - 1]?.emotion ?? 'happy');
    };

    const refreshTherapyRequests = () => {
      setTherapyRequests(getStoredTherapyRequests());
    };

    window.addEventListener('auticare-activities-updated', refreshActivities);
    window.addEventListener('auticare-emotions-updated', refreshEmotions);
    window.addEventListener(THERAPY_REQUESTS_UPDATED_EVENT, refreshTherapyRequests);
    window.addEventListener('storage', refreshActivities);

    return () => {
      window.removeEventListener('auticare-activities-updated', refreshActivities);
      window.removeEventListener('auticare-emotions-updated', refreshEmotions);
      window.removeEventListener(THERAPY_REQUESTS_UPDATED_EVENT, refreshTherapyRequests);
      window.removeEventListener('storage', refreshActivities);
    };
  }, []);

  const emotionDisplay = {
    happy: { emoji: '😊', label: 'État émotionnel positif' },
    sad: { emoji: '😢', label: 'État émotionnel triste' },
    angry: { emoji: '😠', label: 'État émotionnel stressé' },
    calm: { emoji: '😌', label: 'État émotionnel calme' },
  }[latestEmotion];

  const completedToday = activities.filter(a => a.completed).length;
  const totalActivities = activities.length;
  const incomingTherapies = therapyRequests.filter(
    (request) => request.status === 'pending' || (request.status === 'accepted' && !request.confirmed)
  );
  const confirmedTherapies = therapyRequests.filter((request) => request.status === 'accepted' && request.confirmed);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
     {/* En-tête */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Tableau de bord</h1>
              <p className="text-gray-600 mt-1">Bienvenue ! Voici le résumé du jour</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Résumé du jour */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-3xl font-bold text-blue-500">{completedToday}/{totalActivities}</span>
            </div>
            <h3 className="font-medium text-gray-900">Activités du jour</h3>
            <p className="text-sm text-gray-600 mt-1">Activités complétées</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-green-500" />
              </div>
              <span className="text-3xl font-bold text-green-500">{emotionDisplay.emoji}</span>
            </div>
            <h3 className="font-medium text-gray-900">Humeur du jour</h3>
            <p className="text-sm text-gray-600 mt-1">{emotionDisplay.label}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
              <span className="text-3xl font-bold text-purple-500">+12%</span>
            </div>
            <h3 className="font-medium text-gray-900">Progression</h3>
            <p className="text-sm text-gray-600 mt-1">Cette semaine</p>
          </div>
        </div>

        {/* Accès rapide */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Accès rapide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/parent/program"
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                <FileText className="w-6 h-6 text-blue-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Programme quotidien</h3>
              <p className="text-sm text-gray-600">Voir les activités du jour</p>
            </Link>

            <Link
              to="/parent/games"
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500 transition-colors">
                <Gamepad2 className="w-6 h-6 text-purple-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Jeux éducatifs</h3>
              <p className="text-sm text-gray-600">Jouer et apprendre</p>
            </Link>

            <Link
              to="/parent/marketplace"
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500 transition-colors">
                <Users className="w-6 h-6 text-green-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Trouver un thérapeute</h3>
              <p className="text-sm text-gray-600">Marketplace de services</p>
            </Link>

            <Link
              to="/parent/progress"
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow group"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-500 transition-colors">
                <TrendingUp className="w-6 h-6 text-orange-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Suivi de progression</h3>
              <p className="text-sm text-gray-600">Statistiques et graphiques</p>
            </Link>
          </div>
        </div>

        {/* Incoming therapies */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Thérapies entrantes</h2>
              <p className="text-sm text-gray-600 mt-1">Vos demandes et propositions récentes au même endroit</p>
            </div>
            <Link
              to="/parent/requests"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Voir tout
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mb-5">
            <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
              <p className="text-sm text-orange-700">En attente</p>
              <p className="text-2xl font-bold text-orange-900">{incomingTherapies.filter((request) => request.status === 'pending').length}</p>
            </div>
            <div className="rounded-xl border border-green-100 bg-green-50 p-4">
              <p className="text-sm text-green-700">À confirmer</p>
              <p className="text-2xl font-bold text-green-900">{incomingTherapies.filter((request) => request.status === 'accepted').length}</p>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-sm text-emerald-700">Confirmées</p>
              <p className="text-2xl font-bold text-emerald-900">{confirmedTherapies.length}</p>
            </div>
          </div>

          {incomingTherapies.length === 0 ? (
            <div className="rounded-xl border border-dashed border-blue-200 bg-blue-50/60 p-6 text-center">
              <p className="text-gray-700 font-medium mb-1">Aucune thérapie entrante pour le moment</p>
              <p className="text-sm text-gray-600 mb-4">Les réponses des professionnels apparaîtront ici dès qu’elles arrivent.</p>
              <Link to="/parent/therapy-request">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl">
                  Envoyer une demande
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {incomingTherapies.slice(0, 3).map((request) => {
                const isAccepted = request.status === 'accepted';

                return (
                  <div key={request.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isAccepted ? 'bg-green-100' : 'bg-orange-100'}`}>
                        {isAccepted ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <Clock className="w-5 h-5 text-orange-600" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{request.therapyType}</h3>
                        <p className="text-sm text-gray-600">{request.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{isAccepted ? 'Proposition reçue du professionnel' : 'Demande en attente de réponse'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isAccepted ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {isAccepted ? 'À confirmer' : 'En attente'}
                      </span>
                      <Link to="/parent/requests">
                        <Button variant="outline" className="rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50">
                          Ouvrir
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Activités recommandées */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Activités recommandées</h2>
          <div className="space-y-3">
            {activities.slice(0, 3).map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Gamepad2 className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{activity.title}</h3>
                    <p className="text-sm text-gray-600">{activity.time}</p>
                  </div>
                </div>
                <Link
                  to="/parent/program"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Commencer
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Notifications</h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Nouvelle réponse de thérapeute</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Dr. Amira Ben Salem a accepté votre demande de séance
                </p>
                <p className="text-xs text-gray-500 mt-2">Il y a 2 heures</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Nouvelle activité disponible</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Un nouveau jeu de reconnaissance des couleurs est disponible
                </p>
                <p className="text-xs text-gray-500 mt-2">Il y a 5 heures</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
