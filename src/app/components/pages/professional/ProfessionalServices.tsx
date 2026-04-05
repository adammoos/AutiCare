import { useEffect, useMemo, useState } from "react";
import { Plus, Edit, Trash2, Briefcase } from "lucide-react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { clearMarketplaceServicesForProfessional, roundDownToMultipleOf5, syncMarketplaceServicesForProfessional, mockProfessionals } from "../../../lib/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { useAuth } from "../../../contexts/AuthContext";

interface Service {
  id: string;
  professionalId: string;
  therapyType: string;
  price: number;
  availability: string;
  description: string;
}

const DEFAULT_THERAPY_TYPES = [
  'Orthophonie',
  'Psychologie',
  'Psychomotricité',
  'Thérapie comportementale',
  'Ergothérapie',
  'Éducateur spécialisé',
];

const defaultServices: Service[] = [
  {
    id: '1',
    professionalId: 'default-professional',
    therapyType: 'Orthophonie',
    price: 40,
    availability: 'Lundi - Vendredi, 9h-17h',
    description: 'Séances d\'orthophonie pour améliorer la communication verbale',
  },
  {
    id: '2',
    professionalId: 'default-professional',
    therapyType: 'Thérapie comportementale',
    price: 50,
    availability: 'Mardi - Samedi, 10h-18h',
    description: 'Accompagnement comportemental adapté',
  },
];

const MARKETPLACE_UPDATED_EVENT = 'auticare-marketplace-updated';

export function ProfessionalServices() {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  
  const [isAddingService, setIsAddingService] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    selectedTherapyType: '',
    customTherapyType: '',
    price: '',
    availability: '',
    description: '',
  });

  const servicesStorageKey = useMemo(() => `professional_services_${user?.id ?? 'default'}`, [user?.id]);

  const therapyTypeOptions = useMemo(() => {
    return Array.from(new Set([...DEFAULT_THERAPY_TYPES, ...services.map((service) => service.therapyType)]));
  }, [services]);

  const getResolvedTherapyType = () => {
    if (formData.selectedTherapyType === 'other') {
      return formData.customTherapyType.trim();
    }

    return formData.selectedTherapyType.trim();
  };

  const saveServices = (nextServices: Service[]) => {
    setServices(nextServices);
    localStorage.setItem(servicesStorageKey, JSON.stringify(nextServices));
  };

  useEffect(() => {
    const savedServices = JSON.parse(localStorage.getItem(servicesStorageKey) || 'null') as Service[] | null;
    const initialServices = (savedServices && savedServices.length > 0 ? savedServices : defaultServices).map((service) => ({
      ...service,
      professionalId: user?.id ?? service.professionalId,
    }));

    setServices(initialServices);
    localStorage.setItem(servicesStorageKey, JSON.stringify(initialServices));

    if (user && user.role === 'professional') {
      // Get professional info from mockProfessionals or use current user data
      const mockPro = mockProfessionals.find(p => p.name.toLowerCase() === user.name.toLowerCase());
      
      syncMarketplaceServicesForProfessional(
        {
          id: user.id,
          name: user.name,
          location: user.location || mockPro?.location || 'Tunis',
          rating: mockPro?.rating ?? 4.8,
          reviews: mockPro?.reviews ?? 0,
        },
        initialServices,
      );
    }
  }, [servicesStorageKey, user]);
  
  const handleAddService = () => {
    const resolvedTherapyType = getResolvedTherapyType();

    if (!resolvedTherapyType) {
      return;
    }

    const newService: Service = {
      id: Date.now().toString(),
      professionalId: user?.id ?? 'default-professional',
      therapyType: resolvedTherapyType,
      price: roundDownToMultipleOf5(Number(formData.price)),
      availability: formData.availability,
      description: formData.description,
    };

    const nextServices = [...services, newService];
    saveServices(nextServices);

    if (user && user.role === 'professional') {
      // Get professional info from mockProfessionals or use current user data
      const mockPro = mockProfessionals.find(p => p.name.toLowerCase() === user.name.toLowerCase());
      
      syncMarketplaceServicesForProfessional(
        {
          id: user.id,
          name: user.name,
          location: user.location || mockPro?.location || 'Tunis',
          rating: mockPro?.rating ?? 4.8,
          reviews: mockPro?.reviews ?? 0,
        },
        nextServices,
      );
    }

    setFormData({ selectedTherapyType: '', customTherapyType: '', price: '', availability: '', description: '' });
    setIsAddingService(false);
  };
  
  const handleUpdateService = () => {
    if (!editingService) return;

    const resolvedTherapyType = getResolvedTherapyType();
    if (!resolvedTherapyType) {
      return;
    }

    const nextServices = services.map(s =>
      s.id === editingService.id
        ? {
            ...s,
            therapyType: resolvedTherapyType,
            price: roundDownToMultipleOf5(Number(formData.price)),
            availability: formData.availability,
            description: formData.description,
          }
        : s
    );

    saveServices(nextServices);

    if (user && user.role === 'professional') {
      // Get professional info from mockProfessionals or use current user data
      const mockPro = mockProfessionals.find(p => p.name.toLowerCase() === user.name.toLowerCase());
      
      syncMarketplaceServicesForProfessional(
        {
          id: user.id,
          name: user.name,
          location: user.location || mockPro?.location || 'Tunis',
          rating: mockPro?.rating ?? 4.8,
          reviews: mockPro?.reviews ?? 0,
        },
        nextServices,
      );
    }
    
    setEditingService(null);
    setFormData({ selectedTherapyType: '', customTherapyType: '', price: '', availability: '', description: '' });
  };
  
  const handleDeleteService = (id: string) => {
    const nextServices = services.filter(s => s.id !== id);
    saveServices(nextServices);

    if (user && user.role === 'professional') {
      // Get professional info from mockProfessionals or use current user data
      const mockPro = mockProfessionals.find(p => p.name.toLowerCase() === user.name.toLowerCase());
      
      syncMarketplaceServicesForProfessional(
        {
          id: user.id,
          name: user.name,
          location: user.location || mockPro?.location || 'Tunis',
          rating: mockPro?.rating ?? 4.8,
          reviews: mockPro?.reviews ?? 0,
        },
        nextServices,
      );

      if (nextServices.length === 0) {
        clearMarketplaceServicesForProfessional(user.id);
      }
    }
  };
  
  const startEdit = (service: Service) => {
    const typeExistsInDefault = DEFAULT_THERAPY_TYPES.includes(service.therapyType);
    setEditingService(service);
    setFormData({
      selectedTherapyType: typeExistsInDefault ? service.therapyType : 'other',
      customTherapyType: typeExistsInDefault ? '' : service.therapyType,
      price: service.price.toString(),
      availability: service.availability,
      description: service.description,
    });
  };
  
  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const renderServiceForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="therapyType" className="mb-2 block">Type de thérapie</Label>
        <Select
          value={formData.selectedTherapyType}
          onValueChange={(value) => {
            updateFormData('selectedTherapyType', value);
            if (value !== 'other') {
              updateFormData('customTherapyType', '');
            }
          }}
        >
          <SelectTrigger className="h-11 rounded-xl" id="therapyType">
            <SelectValue placeholder="Sélectionnez un type" />
          </SelectTrigger>
          <SelectContent>
            {therapyTypeOptions.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
            <SelectItem value="other">Autre (personnalisé)</SelectItem>
          </SelectContent>
        </Select>

        {formData.selectedTherapyType === 'other' && (
          <Input
            id="customTherapyType"
            value={formData.customTherapyType}
            onChange={(e) => updateFormData('customTherapyType', e.target.value)}
            placeholder="Tapez le type de thérapie"
            className="h-11 rounded-xl mt-3"
          />
        )}
      </div>
      
      <div>
        <Label htmlFor="price" className="mb-2 block">Prix (TND)</Label>
        <Input
          id="price"
          type="number"
          value={formData.price}
          onChange={(e) => updateFormData('price', e.target.value)}
          placeholder="Ex: 80"
          className="h-11 rounded-xl"
        />
      </div>
      
      <div>
        <Label htmlFor="availability" className="mb-2 block">Disponibilité</Label>
        <Input
          id="availability"
          value={formData.availability}
          onChange={(e) => updateFormData('availability', e.target.value)}
          placeholder="Ex: Lundi - Vendredi, 9h-17h"
          className="h-11 rounded-xl"
        />
      </div>
      
      <div>
        <Label htmlFor="description" className="mb-2 block">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => updateFormData('description', e.target.value)}
          placeholder="Décrivez votre service"
          className="h-11 rounded-xl"
        />
      </div>
      
      <Button
        onClick={editingService ? handleUpdateService : handleAddService}
        disabled={!getResolvedTherapyType() || !formData.price}
        className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl h-11"
      >
        {editingService ? 'Mettre à jour' : 'Ajouter le service'}
      </Button>
    </div>
  );
  
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-800">Mes services</h1>
            <p className="text-gray-600">Gérez vos offres de thérapie</p>
          </div>
          
          <Dialog open={isAddingService} onOpenChange={setIsAddingService}>
            <DialogTrigger asChild>
              <Button className="bg-green-500 hover:bg-green-600 text-white rounded-xl">
                <Plus className="w-5 h-5 mr-2" />
                Ajouter un service
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau service</DialogTitle>
              </DialogHeader>
              {renderServiceForm()}
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {services.length === 0 ? (
        <Card className="p-12 text-center border-gray-200">
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Vous n'avez pas encore ajouté de service</p>
          <Button
            onClick={() => setIsAddingService(true)}
            className="bg-green-500 hover:bg-green-600 text-white rounded-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Ajouter votre premier service
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <Card key={service.id} className="p-6 border-blue-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{service.therapyType}</h3>
                  <p className="text-gray-600 mb-3">{service.description}</p>
                  
                  <div className="flex flex-wrap gap-4 mb-3">
                    <div>
                      <span className="text-sm text-gray-600">Prix :</span>
                      <span className="ml-2 font-semibold text-gray-800">{service.price} TND</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Disponibilité :</span>
                      <span className="ml-2 font-medium text-gray-800">{service.availability}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Dialog open={editingService?.id === service.id} onOpenChange={(open) => {
                    if (!open) {
                      setEditingService(null);
                      setFormData({ selectedTherapyType: '', customTherapyType: '', price: '', availability: '', description: '' });
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(service)}
                        className="border-blue-300 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Modifier le service</DialogTitle>
                      </DialogHeader>
                      {renderServiceForm()}
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteService(service.id)}
                    className="border-red-300 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
