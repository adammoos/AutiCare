import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Send, FileText, Calendar as CalendarIcon } from "lucide-react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Calendar } from "../../ui/calendar";
import { mockProfessionals, Professional } from "../../../lib/mockData";
import { useAuth } from "../../../contexts/AuthContext";
import { useNotifications } from "../../../contexts/NotificationContext";
import { fr } from 'date-fns/locale';
import { format } from 'date-fns';
import { toast } from "sonner";

export function ParentTherapyRequest() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [formData, setFormData] = useState({
    professionalId: "",
    professionalName: "",
    therapyType: "",
    childName: "",
    childAge: "",
    description: "",
    preferredDate: undefined as Date | undefined,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const savedProfessionals = JSON.parse(localStorage.getItem('professionals') || '[]');
    setProfessionals([...mockProfessionals, ...savedProfessionals]);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.professionalId || !formData.childName || !formData.childAge || !formData.description || !formData.preferredDate) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setIsSubmitting(true);
    
    // Sauvegarder la demande dans localStorage
    const requests = JSON.parse(localStorage.getItem('therapy_requests') || '[]');
    const newRequest = {
      id: `req-${Date.now()}`,
      parentId: user?.id || 'current-user',
      parentName: user?.name || 'Parent actuel',
      professionalId: formData.professionalId,
      professionalName: formData.professionalName,
      therapyType: formData.therapyType,
      childName: formData.childName,
      childAge: Number(formData.childAge),
      description: formData.description,
      preferredDate: format(formData.preferredDate, 'yyyy-MM-dd'),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    requests.push(newRequest);
    localStorage.setItem('therapy_requests', JSON.stringify(requests));
    
    // Notifier le professionnel (simulation)
    addNotification({
      type: 'request',
      title: 'Demande envoyée',
      message: `Votre demande a été envoyée à ${formData.professionalName}`,
    });
    
    toast.success('Demande envoyée avec succès ! 🎉');
    
    setTimeout(() => {
      navigate('/parent/requests');
    }, 1000);
  };
  
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProfessionalChange = (professionalId: string) => {
    const professional = professionals.find(p => p.id === professionalId);
    if (professional) {
      setFormData(prev => ({
        ...prev,
        professionalId,
        professionalName: professional.name,
        therapyType: professional.specialty,
      }));
    }
  };

  // Disable past dates
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Demande de thérapie</h1>
        </div>
        <p className="text-gray-600">Sélectionnez un thérapeute et décrivez vos besoins</p>
      </div>
      
      <Card className="p-8 border-blue-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-gray-700 mb-3 block text-lg">
              Sélectionner un thérapeute
            </Label>
            <Select value={formData.professionalId} onValueChange={handleProfessionalChange}>
              <SelectTrigger className="h-12 rounded-xl border-gray-300">
                <SelectValue placeholder="Choisissez un thérapeute" />
              </SelectTrigger>
              <SelectContent>
                {professionals.map((prof) => (
                  <SelectItem key={prof.id} value={prof.id}>
                    {prof.name} - {prof.specialty} ({prof.location})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description" className="text-gray-700 mb-3 block text-lg">
              Décrivez la situation de votre enfant
            </Label>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="childName" className="text-gray-700 mb-2 block">
                  Nom de l'enfant
                </Label>
                <Input
                  id="childName"
                  value={formData.childName}
                  onChange={(e) => updateFormData('childName', e.target.value)}
                  placeholder="Ex: Adam Ben Salah"
                  className="h-11 rounded-xl border-gray-300"
                  required
                />
              </div>
              <div>
                <Label htmlFor="childAge" className="text-gray-700 mb-2 block">
                  Age de l'enfant
                </Label>
                <Input
                  id="childAge"
                  type="number"
                  min={1}
                  max={18}
                  value={formData.childAge}
                  onChange={(e) => updateFormData('childAge', e.target.value)}
                  placeholder="Ex: 7"
                  className="h-11 rounded-xl border-gray-300"
                  required
                />
              </div>
            </div>

            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              placeholder="Décrivez les besoins de votre enfant, les objectifs que vous souhaitez atteindre, les difficultés rencontrées..."
              rows={6}
              className="rounded-xl border-gray-300 resize-none"
              required
            />
            <p className="text-sm text-gray-500 mt-2">
              Plus vous donnez de détails, mieux le professionnel pourra vous aider
            </p>
          </div>
          
          <div>
            <Label className="text-gray-700 mb-3 block text-lg flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Choisissez une date préférée
            </Label>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={formData.preferredDate}
                onSelect={(date) => updateFormData('preferredDate', date)}
                disabled={isDateDisabled}
                locale={fr}
                className="rounded-xl border"
              />
            </div>
            {formData.preferredDate && (
              <p className="text-center text-sm text-gray-600 mt-3">
                Date sélectionnée : {format(formData.preferredDate, 'dd MMMM yyyy', { locale: fr })}
              </p>
            )}
          </div>
          
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || !formData.professionalId || !formData.childName || !formData.childAge || !formData.description || !formData.preferredDate}
              className="w-full h-14 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-xl text-lg disabled:opacity-50"
            >
              {isSubmitting ? (
                'Envoi en cours...'
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Envoyer la demande
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
      
      <Card className="mt-6 p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold mb-2 text-gray-800">💡 Comment ça marche ?</h3>
        <ul className="text-sm text-gray-700 space-y-2">
          <li>✓ Choisissez le thérapeute qui correspond à vos besoins</li>
          <li>✓ Décrivez la situation de votre enfant en détail</li>
          <li>✓ Sélectionnez une date préférée pour la première séance</li>
          <li>✓ Le thérapeute examinera votre demande et pourra l'accepter ou proposer une autre date</li>
          <li>✓ Vous recevrez une notification avec la réponse du thérapeute</li>
        </ul>
      </Card>
    </div>
  );
}
