import { useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import { ArrowLeft, MapPin, Clock, Star, Phone, MessageCircle, Calendar, BadgeCheck } from "lucide-react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { addTherapyRequest, getStoredMarketplaceServices, mockProfessionals, Professional } from "../../../lib/mockData";
import { MessageDialog } from "../../shared/MessageDialog";
import { SessionBookingDialog } from "../../shared/SessionBookingDialog";
import { useNotifications } from "../../../contexts/NotificationContext";
import { useAuth } from "../../../contexts/AuthContext";
import { toast } from "sonner";

export function ParentDoctorProfile() {
  const { doctorId } = useParams();
  const location = useLocation();
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);

  const stateDoctor = (location.state as {
    doctorProfile?: {
      id: string;
      name: string;
      specialty: string;
      location: string;
      availability: string;
      price: number;
      rating: number;
      reviews: number;
      email?: string;
    };
  } | null)?.doctorProfile;

  const savedProfessionals = JSON.parse(localStorage.getItem('professionals') || '[]') as Professional[];
  const allProfessionals = [...mockProfessionals, ...savedProfessionals];
  const mappedDoctor = allProfessionals.find((professional) => professional.id === doctorId);
  const serviceDoctor = getStoredMarketplaceServices().find((service) => service.professionalId === doctorId);

  const doctor: Professional = stateDoctor
    ? {
        id: stateDoctor.id,
        name: stateDoctor.name,
        specialty: stateDoctor.specialty,
        location: stateDoctor.location,
        availability: stateDoctor.availability,
        price: stateDoctor.price,
        rating: stateDoctor.rating,
        reviews: stateDoctor.reviews,
        email: stateDoctor.email,
      }
    : mappedDoctor
      ?? (serviceDoctor
        ? {
            id: serviceDoctor.professionalId,
            name: serviceDoctor.professionalName,
            specialty: serviceDoctor.specialty,
            location: serviceDoctor.location,
            availability: serviceDoctor.availability,
            price: serviceDoctor.price,
            rating: serviceDoctor.rating,
            reviews: serviceDoctor.reviews,
            email: serviceDoctor.email,
          }
        : mockProfessionals[0]);

  const doctorPhoneById: Record<string, string> = {
    '1': '+216 20 123 456',
    '2': '+216 21 456 789',
    '3': '+216 24 987 123',
    '4': '+216 25 765 432',
    '5': '+216 22 345 678',
  };

  const doctorPhone = doctorPhoneById[doctor.id] ?? '+216 70 000 000';

  const handleBookSession = (professional: Professional) => {
    setBookingDialogOpen(true);
  };

  const handleConfirmBooking = (date: Date, time: string) => {
    const formattedDate = date.toLocaleDateString('fr-FR');

    addTherapyRequest({
      parentId: user?.id ?? 'current-user',
      parentName: user?.name ?? 'Parent actuel',
      therapyType: doctor.specialty,
      description: `Demande de réservation envoyée à ${doctor.name}`,
      availability: `Créneau demandé : ${formattedDate} à ${time}`,
      status: 'pending',
      professionalId: doctor.id,
    });

    addNotification({
      type: 'request',
      title: 'Demande envoyée',
      message: `Votre demande avec ${doctor.name} est en attente (${formattedDate} à ${time})`,
      actionLabel: 'Voir mes demandes',
      actionHref: '/parent/requests',
    });
    toast.success('Demande envoyée, en attente de validation ✅');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <Link to="/parent/marketplace" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4">
          <ArrowLeft className="w-4 h-4" />
          Retour au marché
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Profil du docteur</h1>
        <p className="text-gray-600">Consultez ses informations avant de réserver une séance</p>
      </div>

      <Card className="p-8 mb-6 border-blue-100">
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold">
            {doctor.name.charAt(0)}
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{doctor.name}</h2>
                <p className="text-blue-600 font-semibold text-lg">{doctor.specialty}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-yellow-50 border border-yellow-200 px-3 py-2 rounded-full w-fit">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                {doctor.rating} ({doctor.reviews} avis)
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                <MapPin className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Localisation</p>
                  <p className="font-medium text-gray-800">{doctor.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                <Clock className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Disponibilité</p>
                  <p className="font-medium text-gray-800">{doctor.availability}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-[1.4fr_0.9fr] gap-6">
        <Card className="p-6 border-blue-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">À propos</h3>
          <p className="text-gray-700 leading-7 mb-6">
            {doctor.name} accompagne les familles avec une approche personnalisée centrée sur les besoins de l’enfant, la communication avec les parents et le suivi régulier des progrès.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
              <p className="text-sm text-gray-600 mb-1">Spécialité</p>
              <p className="font-semibold text-gray-800">{doctor.specialty}</p>
            </div>
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
              <p className="text-sm text-gray-600 mb-1">Tarif</p>
              <p className="font-semibold text-gray-800">{doctor.price} TND / séance</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-blue-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Actions rapides</h3>
          <div className="space-y-3">
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
              onClick={() => handleBookSession(doctor)}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Réserver une séance
            </Button>

            <MessageDialog
              recipientId={doctor.id}
              recipientName={doctor.name}
              triggerButton={
                <Button variant="outline" className="w-full rounded-xl border-green-200 text-green-700 hover:bg-green-50">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Envoyer un message
                </Button>
              }
            />

            <div className="w-full rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 flex items-center gap-2 text-blue-800">
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">Téléphone : {doctorPhone}</span>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-3">
            <BadgeCheck className="w-5 h-5 text-emerald-600 mt-0.5" />
            <p className="text-sm text-emerald-800">
              Profil vérifié et disponible pour les parents sur AutiCare.
            </p>
          </div>
        </Card>
      </div>

      <SessionBookingDialog
        isOpen={bookingDialogOpen}
        onClose={() => setBookingDialogOpen(false)}
        onConfirm={handleConfirmBooking}
        professionalName={doctor.name}
      />
    </div>
  );
}