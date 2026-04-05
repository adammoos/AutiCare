import { useState, useEffect } from "react";
import { Link } from "react-router";
import { MapPin, Clock, Star, MessageCircle, Calendar, Search, Filter, UserRound, Mail } from "lucide-react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { addTherapyRequest, getStoredMarketplaceServices, mockProfessionals, MarketplaceServiceOffer, Professional } from "../../../lib/mockData";
import { MessageDialog } from "../../shared/MessageDialog";
import { SessionBookingDialog } from "../../shared/SessionBookingDialog";
import { ReviewDialog } from "../../shared/ReviewDialog";
import { useNotifications } from "../../../contexts/NotificationContext";
import { useAuth } from "../../../contexts/AuthContext";
import { toast } from "sonner";

const MARKETPLACE_UPDATED_EVENT = 'auticare-marketplace-updated';

export function ParentMarketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [marketplaceServices, setMarketplaceServices] = useState<MarketplaceServiceOffer[]>([]);
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  useEffect(() => {
    const loadMarketplaceData = () => {
      const savedProfessionals = JSON.parse(localStorage.getItem('professionals') || '[]') as Professional[];
      const normalizedSavedProfessionals = savedProfessionals.filter((professional) => {
        const professionalId = typeof professional.id === 'string' ? professional.id : '';
        return professional.name.trim().toLowerCase() !== 'adammoosbusiness' && !professionalId.startsWith('service-');
      });

      if (normalizedSavedProfessionals.length !== savedProfessionals.length) {
        localStorage.setItem('professionals', JSON.stringify(normalizedSavedProfessionals));
      }

      setProfessionals([...mockProfessionals, ...normalizedSavedProfessionals]);
      setMarketplaceServices(getStoredMarketplaceServices());
    };

    loadMarketplaceData();
    window.addEventListener(MARKETPLACE_UPDATED_EVENT, loadMarketplaceData);
    window.addEventListener('storage', loadMarketplaceData);

    return () => {
      window.removeEventListener(MARKETPLACE_UPDATED_EVENT, loadMarketplaceData);
      window.removeEventListener('storage', loadMarketplaceData);
    };
  }, []);

  const cities = ["all", ...new Set([...professionals, ...marketplaceServices].map((item) => item.location.split(',')[0].trim()))];
  const specialties = ["all", ...new Set([...professionals, ...marketplaceServices].map((item) => item.specialty))];
  
  const filteredProfessionals = professionals.filter(prof => {
    const matchesSearch = prof.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === "all" || prof.location.toLowerCase().includes(selectedCity.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "all" || prof.specialty === selectedSpecialty;
    
    return matchesSearch && matchesCity && matchesSpecialty;
  });

  const filteredMarketplaceServices = marketplaceServices.filter((service) => {
    const matchesSearch = service.professionalName.toLowerCase().includes(searchTerm.toLowerCase()) || service.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === "all" || service.location.toLowerCase().includes(selectedCity.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "all" || service.specialty === selectedSpecialty;

    return matchesSearch && matchesCity && matchesSpecialty;
  });

  const handleBookSession = (professional: Professional) => {
    setSelectedProfessional(professional);
    setBookingDialogOpen(true);
  };

  const handleConfirmBooking = (date: Date, time: string) => {
    if (selectedProfessional) {
      const formattedDate = date.toLocaleDateString('fr-FR');

      addTherapyRequest({
        parentId: user?.id ?? 'current-user',
        parentName: user?.name ?? 'Parent actuel',
        therapyType: selectedProfessional.specialty,
        description: `Demande de réservation envoyée à ${selectedProfessional.name}`,
        availability: `Créneau demandé : ${formattedDate} à ${time}`,
        status: 'pending',
        professionalId: selectedProfessional.id,
      });

      addNotification({
        type: 'request',
        title: 'Demande envoyée',
        message: `Votre demande avec ${selectedProfessional.name} est en attente (${formattedDate} à ${time})`,
        actionLabel: 'Voir mes demandes',
        actionHref: '/parent/requests',
      });
      toast.success('Demande envoyée, en attente de validation ✅');
    }
  };

  const handleLeaveReview = (professional: Professional) => {
    setSelectedProfessional(professional);
    setReviewDialogOpen(true);
  };

  const handleSubmitReview = (rating: number, comment: string) => {
    // Dans une vraie app, on sauvegarderait l'avis dans la base de données
    console.log('Review submitted:', { professionalId: selectedProfessional?.id, rating, comment });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Trouver un thérapeute</h1>
        <p className="text-gray-600">Parcourez les professionnels disponibles</p>
      </div>
      
      {/* Advanced Filters */}
      <Card className="p-6 mb-8 border-blue-100">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">Filtres de recherche</h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Rechercher par nom
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Nom du thérapeute..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 rounded-xl border-gray-300"
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Ville
            </label>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="h-11 rounded-xl border-gray-300">
                <SelectValue placeholder="Sélectionner une ville" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les villes</SelectItem>
                {cities.filter(c => c !== "all").map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Type de thérapie
            </label>
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger className="h-11 rounded-xl border-gray-300">
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {specialties.filter(s => s !== "all").map(specialty => (
                  <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {(searchTerm || selectedCity !== "all" || selectedSpecialty !== "all") && (
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {filteredProfessionals.length} professionnel(s) trouvé(s)
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setSelectedCity("all");
                setSelectedSpecialty("all");
              }}
            >
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </Card>
      
      {/* Quick Action */}
      <Card className="p-6 mb-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1 text-gray-800">
              Vous savez ce dont vous avez besoin ?
            </h3>
            <p className="text-gray-600">Envoyez une demande de thérapie directement</p>
          </div>
          <Link to="/parent/therapy-request">
            <Button className="bg-green-500 hover:bg-green-600 text-white rounded-xl">
              Envoyer une demande
            </Button>
          </Link>
        </div>
      </Card>
      
      {/* Professionals List */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredProfessionals.map((professional) => (
          <Card key={professional.id} className="p-6 hover:shadow-lg transition-shadow border-blue-100">
            <div className="flex gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                {professional.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800">{professional.name}</h3>
                <p className="text-blue-600 font-medium">{professional.specialty}</p>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{professional.location}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{professional.availability}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-semibold">{professional.rating}</span>
                  <span className="text-sm text-gray-600">({professional.reviews} avis)</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLeaveReview(professional)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Laisser un avis
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <span className="text-2xl font-bold text-gray-800">{professional.price} TND</span>
              <span className="text-sm text-gray-600">par séance</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Link to={`/parent/marketplace/doctor/${professional.id}`}>
                <Button 
                  variant="outline" 
                  className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 rounded-xl w-full"
                >
                  <UserRound className="w-4 h-4 mr-1" />
                  Voir le profil
                </Button>
              </Link>
              
              <MessageDialog
                recipientId={professional.id}
                recipientName={professional.name}
                triggerButton={
                  <Button 
                    variant="outline" 
                    className="border-2 border-green-300 text-green-600 hover:bg-green-50 rounded-xl w-full"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Message
                  </Button>
                }
              />

              <Button 
                className="bg-purple-500 hover:bg-purple-600 text-white rounded-xl sm:col-span-2"
                onClick={() => handleBookSession(professional)}
              >
                <Calendar className="w-4 h-4 mr-1" />
                Séance
              </Button>
            </div>
          </Card>
        ))}
      </div>
      
      {filteredProfessionals.length === 0 && filteredMarketplaceServices.length === 0 && (
        <Card className="p-12 text-center border-gray-200">
          <p className="text-gray-600">Aucun professionnel trouvé avec ces critères</p>
        </Card>
      )}

      {filteredMarketplaceServices.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Nouveaux services</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {filteredMarketplaceServices.map((service) => (
              <Card key={service.id} className="p-6 hover:shadow-lg transition-shadow border-blue-100">
                <div className="flex gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                    {service.professionalName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800">{service.professionalName}</h3>
                    <p className="text-blue-600 font-medium">{service.specialty}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{service.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{service.availability}</span>
                  </div>
                  {service.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{service.email}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-semibold">{service.rating}</span>
                      <span className="text-sm text-gray-600">({service.reviews} avis)</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedProfessional({
                          id: service.professionalId,
                          name: service.professionalName,
                          specialty: service.specialty,
                          location: service.location,
                          availability: service.availability,
                          price: service.price,
                          rating: service.rating,
                          reviews: service.reviews,
                        });
                        setReviewDialogOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Laisser un avis
                    </Button>
                  </div>

                  <p className="text-sm text-gray-600">{service.description}</p>
                </div>

                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                  <span className="text-2xl font-bold text-gray-800">{service.price} TND</span>
                  <span className="text-sm text-gray-600">par séance</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Link
                    to={`/parent/marketplace/doctor/${service.professionalId}`}
                    state={{
                      doctorProfile: {
                        id: service.professionalId,
                        name: service.professionalName,
                        specialty: service.specialty,
                        location: service.location,
                        availability: service.availability,
                        price: service.price,
                        rating: service.rating,
                        reviews: service.reviews,
                        email: service.email,
                      },
                    }}
                  >
                    <Button
                      variant="outline"
                      className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 rounded-xl w-full"
                    >
                      <UserRound className="w-4 h-4 mr-1" />
                      Voir le profil
                    </Button>
                  </Link>

                  <MessageDialog
                    recipientId={service.professionalId}
                    recipientName={service.professionalName}
                    triggerButton={
                      <Button
                        variant="outline"
                        className="border-2 border-green-300 text-green-600 hover:bg-green-50 rounded-xl w-full"
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Message
                      </Button>
                    }
                  />

                  <Button
                    className="bg-purple-500 hover:bg-purple-600 text-white rounded-xl sm:col-span-2"
                    onClick={() => handleBookSession({
                      id: service.professionalId,
                      name: service.professionalName,
                      specialty: service.specialty,
                      location: service.location,
                      availability: service.availability,
                      price: service.price,
                      rating: service.rating,
                      reviews: service.reviews,
                    })}
                  >
                    <Calendar className="w-4 h-4 mr-1" />
                    Séance
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedProfessional && (
        <>
          <SessionBookingDialog
            isOpen={bookingDialogOpen}
            onClose={() => setBookingDialogOpen(false)}
            onConfirm={handleConfirmBooking}
            professionalName={selectedProfessional.name}
          />
          
          <ReviewDialog
            isOpen={reviewDialogOpen}
            onClose={() => setReviewDialogOpen(false)}
            professionalName={selectedProfessional.name}
            professionalId={selectedProfessional.id}
            onSubmit={handleSubmitReview}
          />
        </>
      )}
    </div>
  );
}
