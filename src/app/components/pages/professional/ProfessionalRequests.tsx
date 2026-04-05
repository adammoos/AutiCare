import { useState } from "react";
import { Check, X, Phone, MessageCircle, Calendar } from "lucide-react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { getStoredTherapyRequests, updateTherapyRequest } from "../../../lib/mockData";

export function ProfessionalRequests() {
  const [requests, setRequests] = useState(getStoredTherapyRequests());
  const [acceptingRequest, setAcceptingRequest] = useState<string | null>(null);
  const [appointmentData, setAppointmentData] = useState({
    date: '',
    time: '',
  });
  
  const handleReject = (requestId: string) => {
    updateTherapyRequest(requestId, { status: 'rejected' });
    setRequests(getStoredTherapyRequests());
  };
  
  const handleAcceptClick = (requestId: string) => {
    setAcceptingRequest(requestId);
    setAppointmentData({ date: '', time: '' });
  };
  
  const handleConfirmAccept = () => {
    if (!acceptingRequest || !appointmentData.date || !appointmentData.time) return;
    
    updateTherapyRequest(acceptingRequest, {
      status: 'accepted',
      professionalId: 'current-professional',
      scheduledDate: appointmentData.date,
      scheduledTime: appointmentData.time,
      confirmed: false,
    });
    
    setRequests(getStoredTherapyRequests());
    setAcceptingRequest(null);
    setAppointmentData({ date: '', time: '' });
  };
  
  const pendingRequests = requests.filter(r => r.status === 'pending');
  const acceptedRequests = requests.filter(r => r.status === 'accepted');
  const rejectedRequests = requests.filter(r => r.status === 'rejected');
  
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Demandes des parents</h1>
        <p className="text-gray-600">Gérez les demandes de thérapie</p>
      </div>
      
      {/* Summary */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6 border-orange-200 bg-orange-50">
          <p className="text-sm text-orange-700 mb-1">En attente</p>
          <p className="text-3xl font-bold text-orange-900">{pendingRequests.length}</p>
        </Card>
        
        <Card className="p-6 border-green-200 bg-green-50">
          <p className="text-sm text-green-700 mb-1">Acceptées</p>
          <p className="text-3xl font-bold text-green-900">{acceptedRequests.length}</p>
        </Card>
        
        <Card className="p-6 border-red-200 bg-red-50">
          <p className="text-sm text-red-700 mb-1">Refusées</p>
          <p className="text-3xl font-bold text-red-900">{rejectedRequests.length}</p>
        </Card>
      </div>
      
      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Nouvelles demandes</h2>
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <Card key={request.id} className="p-6 border-blue-100 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">{request.therapyType}</h3>
                    <p className="text-sm text-gray-600">Demandé par {request.parentName}</p>
                  </div>
                  <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                    En attente
                  </span>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-700 mb-3">{request.description}</p>
                  <div className="bg-blue-50 rounded-xl p-3">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Disponibilités du parent :</span> {request.availability}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-300 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    Appeler
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-green-300 text-green-600 hover:bg-green-50 rounded-lg"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Message
                  </Button>
                  
                  <div className="flex-1" />
                  
                  <Button
                    onClick={() => handleReject(request.id)}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50 rounded-xl"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Refuser
                  </Button>
                  
                  <Button
                    onClick={() => handleAcceptClick(request.id)}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-xl"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    Accepter
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Accepted Requests */}
      {acceptedRequests.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Demandes acceptées</h2>
          <div className="space-y-4">
            {acceptedRequests.map((request) => (
              <Card key={request.id} className="p-6 border-green-100 bg-green-50">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">{request.therapyType}</h3>
                    <p className="text-sm text-gray-600">Parent : {request.parentName}</p>
                  </div>
                  <span className="px-4 py-2 bg-green-200 text-green-800 rounded-full text-sm font-semibold">
                    Acceptée
                  </span>
                </div>
                
                {request.scheduledDate && request.scheduledTime && (
                  <div className="flex items-center gap-3 bg-white rounded-xl p-4">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-gray-800">
                        Rendez-vous : {new Date(request.scheduledDate).toLocaleDateString('fr-FR')} à {request.scheduledTime}
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Empty State */}
      {pendingRequests.length === 0 && acceptedRequests.length === 0 && (
        <Card className="p-12 text-center border-gray-200">
          <p className="text-gray-600">Aucune demande pour le moment</p>
        </Card>
      )}
      
      {/* Accept Dialog */}
      <Dialog open={!!acceptingRequest} onOpenChange={(open) => !open && setAcceptingRequest(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Proposer un rendez-vous</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="date" className="mb-2 block">Date</Label>
              <Input
                id="date"
                type="date"
                value={appointmentData.date}
                onChange={(e) => setAppointmentData({ ...appointmentData, date: e.target.value })}
                className="h-11 rounded-xl"
              />
            </div>
            
            <div>
              <Label htmlFor="time" className="mb-2 block">Heure</Label>
              <Input
                id="time"
                type="time"
                value={appointmentData.time}
                onChange={(e) => setAppointmentData({ ...appointmentData, time: e.target.value })}
                className="h-11 rounded-xl"
              />
            </div>
            
            <Button
              onClick={handleConfirmAccept}
              disabled={!appointmentData.date || !appointmentData.time}
              className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl h-11"
            >
              Valider la séance
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
