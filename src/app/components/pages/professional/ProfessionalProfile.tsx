import { useEffect, useState } from "react";
import { User, Briefcase, MapPin, Clock, DollarSign, Star, Edit2, Save } from "lucide-react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";

const DEFAULT_PRO_PROFILE = {
  name: 'Dr. Amira Ben Said',
  specialty: 'Orthophoniste',
  location: 'Tunis, Centre-ville',
  availability: 'Lundi - Vendredi, 9h-17h',
  price: '40',
  email: 'amira.bensaid@email.com',
  phone: '+216 20 123 456',
  bio: 'Orthophoniste expérimentée spécialisée dans l\'accompagnement des enfants autistes. Plus de 10 ans d\'expérience dans le domaine.',
  education: 'Master en Orthophonie - Université de Tunis',
  certifications: 'Certification en ABA, Formation en PECS',
};

export function ProfessionalProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const initialProfileData = DEFAULT_PRO_PROFILE;
  const [profileData, setProfileData] = useState(initialProfileData);

  useEffect(() => {
    if (!isEditing) {
      setProfileData(initialProfileData);
    }
  }, [initialProfileData, isEditing]);
  
  const updateProfileData = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSave = () => {
    setIsEditing(false);
    // In real app, save to backend
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-800">Mon profil</h1>
            <p className="text-gray-600">Gérez vos informations professionnelles</p>
          </div>
          
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
            >
              <Edit2 className="w-5 h-5 mr-2" />
              Modifier
            </Button>
          ) : (
            <Button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 text-white rounded-xl"
            >
              <Save className="w-5 h-5 mr-2" />
              Enregistrer
            </Button>
          )}
        </div>
      </div>
      
      {/* Profile Header */}
      <Card className="p-8 mb-6 border-blue-100">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold">
            {profileData.name.charAt(0)}
          </div>
          
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="mb-2 block">Nom complet</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => updateProfileData('name', e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="specialty" className="mb-2 block">Spécialité</Label>
                  <Input
                    id="specialty"
                    value={profileData.specialty}
                    onChange={(e) => updateProfileData('specialty', e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">{profileData.name}</h2>
                <p className="text-blue-600 font-semibold text-lg mb-3">{profileData.specialty}</p>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">4.8</span>
                  <span className="text-gray-600">(42 avis)</span>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>
      
      {/* Contact Information */}
      <Card className="p-6 mb-6 border-blue-100">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Informations de contact</h3>
        
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="mb-2 block">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => updateProfileData('email', e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="mb-2 block">Téléphone</Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => updateProfileData('phone', e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
              <User className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-800">{profileData.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
              <User className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Téléphone</p>
                <p className="font-medium text-gray-800">{profileData.phone}</p>
              </div>
            </div>
          </div>
        )}
      </Card>
      
      {/* Professional Information */}
      <Card className="p-6 mb-6 border-blue-100">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Informations professionnelles</h3>
        
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="location" className="mb-2 block">Localisation</Label>
              <Input
                id="location"
                value={profileData.location}
                onChange={(e) => updateProfileData('location', e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="availability" className="mb-2 block">Disponibilité</Label>
              <Input
                id="availability"
                value={profileData.availability}
                onChange={(e) => updateProfileData('availability', e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="price" className="mb-2 block">Prix par séance (TND)</Label>
              <Input
                id="price"
                type="number"
                value={profileData.price}
                onChange={(e) => updateProfileData('price', e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
              <MapPin className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Localisation</p>
                <p className="font-medium text-gray-800">{profileData.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
              <Clock className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Disponibilité</p>
                <p className="font-medium text-gray-800">{profileData.availability}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl md:col-span-2">
              <DollarSign className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Prix par séance</p>
                <p className="font-medium text-gray-800">{profileData.price} TND</p>
              </div>
            </div>
          </div>
        )}
      </Card>
      
      {/* Bio & Qualifications */}
      <Card className="p-6 border-blue-100">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">À propos</h3>
        
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="bio" className="mb-2 block">Biographie</Label>
              <Textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) => updateProfileData('bio', e.target.value)}
                rows={4}
                className="rounded-xl resize-none"
              />
            </div>
            <div>
              <Label htmlFor="education" className="mb-2 block">Formation</Label>
              <Input
                id="education"
                value={profileData.education}
                onChange={(e) => updateProfileData('education', e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="certifications" className="mb-2 block">Certifications</Label>
              <Input
                id="certifications"
                value={profileData.certifications}
                onChange={(e) => updateProfileData('certifications', e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Biographie</h4>
              <p className="text-gray-700">{profileData.bio}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Formation
              </h4>
              <p className="text-gray-700">{profileData.education}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-600" />
                Certifications
              </h4>
              <p className="text-gray-700">{profileData.certifications}</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
