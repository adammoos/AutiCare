import { useEffect, useState } from "react";
import { Clock, CheckCircle, XCircle, Calendar as CalendarIcon } from "lucide-react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { getStoredTherapyRequests, updateTherapyRequest, THERAPY_REQUESTS_UPDATED_EVENT } from "../../../lib/mockData";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useNotifications } from "../../../contexts/NotificationContext";
import { toast } from "sonner";

export function ParentRequestTracking() {
  const [requests, setRequests] = useState(getStoredTherapyRequests());
  const { addNotification } = useNotifications();

  useEffect(() => {
    const refreshRequests = () => {
      setRequests(getStoredTherapyRequests());
    };

    window.addEventListener(THERAPY_REQUESTS_UPDATED_EVENT, refreshRequests);

    return () => {
      window.removeEventListener(THERAPY_REQUESTS_UPDATED_EVENT, refreshRequests);
    };
  }, []);
  
  const handleConfirmTherapy = (requestId: string, therapyType: string) => {
    updateTherapyRequest(requestId, { confirmed: true });
    setRequests(getStoredTherapyRequests());
    addNotification({
      type: 'response',
      title: 'Thérapie confirmée',
      message: `Vous avez confirmé la séance pour ${therapyType}`,
      actionLabel: 'Voir les demandes',
      actionHref: '/parent/requests',
    });
    toast.success('Thérapie confirmée ! ✅');
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const upcomingTherapies = requests.filter(
    (r) => r.status === 'accepted' && r.scheduledDate && r.scheduledTime && !r.confirmed
  );
  const confirmedTherapies = requests.filter(
    (r) => r.status === 'accepted' && r.scheduledDate && r.scheduledTime && r.confirmed
  );
  const rejectedRequests = requests.filter(r => r.status === 'rejected');
  
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Suivi des demandes</h1>
        <p className="text-gray-600">Gérez vos demandes, thérapies à venir et thérapies confirmées</p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6 border-orange-200 bg-orange-50">
          <div className="flex items-center gap-3">
            <Clock className="w-10 h-10 text-orange-500" />
            <div>
              <p className="text-sm text-orange-700">En attente</p>
              <p className="text-3xl font-bold text-orange-900">{pendingRequests.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border-blue-200 bg-blue-50">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-10 h-10 text-blue-500" />
            <div>
              <p className="text-sm text-blue-700">À venir</p>
              <p className="text-3xl font-bold text-blue-900">{upcomingTherapies.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border-emerald-200 bg-emerald-50">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
            <div>
              <p className="text-sm text-emerald-700">Confirmées</p>
              <p className="text-3xl font-bold text-emerald-900">{confirmedTherapies.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        {requests.length === 0 ? (
          <Card className="p-12 text-center border-gray-200">
            <p className="text-gray-600 mb-4">Vous n'avez pas encore envoyé de demande</p>
            <Button
              onClick={() => window.location.href = '/parent/therapy-request'}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
            >
              Envoyer une demande
            </Button>
          </Card>
        ) : (
          <>
            <Card className="p-6 border-blue-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Thérapies à venir</h2>

              {upcomingTherapies.length === 0 ? (
                <p className="text-gray-600">Aucune thérapie à venir pour le moment.</p>
              ) : (
                <div className="space-y-4">
                  {upcomingTherapies.map((request) => (
                    <div key={request.id} className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-800">{request.therapyType}</h3>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700">À confirmer</span>
                      </div>

                      <p className="text-sm text-gray-700 mb-2">{request.description}</p>
                      <p className="text-sm text-gray-600 mb-3">
                        <span className="font-medium">Demandé le :</span> {format(new Date(request.createdAt), 'dd MMMM yyyy', { locale: fr })}
                      </p>

                      <div className="grid md:grid-cols-2 gap-3 mb-4">
                        <div>
                          <p className="text-sm text-blue-700 mb-1">Date</p>
                          <p className="font-semibold text-blue-900">
                            {format(new Date(request.scheduledDate as string), 'EEEE dd MMMM yyyy', { locale: fr })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-blue-700 mb-1">Heure</p>
                          <p className="font-semibold text-blue-900">{request.scheduledTime}</p>
                        </div>
                      </div>

                      <Button
                        className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl"
                        onClick={() => handleConfirmTherapy(request.id, request.therapyType)}
                      >
                        Confirmer la thérapie
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-6 border-emerald-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Thérapies confirmées</h2>

              {confirmedTherapies.length === 0 ? (
                <p className="text-gray-600">Aucune thérapie confirmée pour le moment.</p>
              ) : (
                <div className="space-y-4">
                  {confirmedTherapies.map((request) => (
                    <div key={request.id} className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-800">{request.therapyType}</h3>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">Confirmée</span>
                      </div>

                      <p className="text-sm text-gray-700 mb-2">{request.description}</p>

                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-sm text-emerald-700 mb-1">Date</p>
                          <p className="font-semibold text-emerald-900">
                            {format(new Date(request.scheduledDate as string), 'EEEE dd MMMM yyyy', { locale: fr })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-emerald-700 mb-1">Heure</p>
                          <p className="font-semibold text-emerald-900">{request.scheduledTime}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {pendingRequests.length > 0 && (
              <Card className="p-6 border-orange-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Demandes en attente</h2>
                <div className="space-y-3">
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-800">{request.therapyType}</h3>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-orange-100 text-orange-700">En attente</span>
                      </div>
                      <p className="text-sm text-gray-700">{request.description}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {rejectedRequests.length > 0 && (
              <Card className="p-6 border-red-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Demandes refusées</h2>
                <div className="space-y-3">
                  {rejectedRequests.map((request) => (
                    <div key={request.id} className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-800">{request.therapyType}</h3>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-700">Refusée</span>
                      </div>
                      <p className="text-sm text-gray-700">{request.description}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}