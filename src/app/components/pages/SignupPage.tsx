import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Heart, Users, Stethoscope } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type Role = "parent" | "professional" | null;

export function SignupPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    // Parent fields
    childAge: "",
    childLevel: "",
    // Professional fields
    specialty: "",
    location: "",
    availability: "",
    price: "",
  });



const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock registration - redirect based on role
    if (role === "parent") {
      navigate("/parent/dashboard");
    } else if (role === "professional") {
      navigate("/professional/dashboard");
    }
  };

   const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl border-2 border-blue-100 shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-green-400 rounded-2xl mb-4 shadow-lg">
            <Heart className="w-8 h-8 text-white" />
          </div>
          
          </div>
          <CardTitle className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">Créer un compte</CardTitle>
          <CardDescription className="text-base">
            Rejoignez la communauté AutiCare
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!role ? (
            <div className="space-y-4">
              <p className="text-center mb-6">Choisissez votre rôle :</p>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => setRole("parent")}
                  className="p-8 border-2 border-blue-200 rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition-all text-center group"
                >
                  <Users className="w-16 h-16 text-blue-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl mb-2">👨‍👩‍👧 Parent</h3>
                  <p className="text-sm text-gray-600">
                    Accompagner mon enfant
                  </p>
                </button>
                <button
                  onClick={() => setRole("professional")}
                  className="p-8 border-2 border-green-200 rounded-2xl hover:border-green-400 hover:bg-green-50 transition-all text-center group"
                >
                  <Stethoscope className="w-16 h-16 text-green-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl mb-2">🧑‍⚕️ Professionnel</h3>
                  <p className="text-sm text-gray-600">
                    Proposer mes services
                  </p>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="h-12 border-2"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="h-12 border-2"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  className="h-12 border-2"
                  required
                />
              </div>

              {role === "parent" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="childAge">Âge de l'enfant</Label>
                    <Input
                      id="childAge"
                      type="number"
                      value={formData.childAge}
                      onChange={(e) => updateField("childAge", e.target.value)}
                      className="h-12 border-2"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="childLevel">Niveau de l'enfant</Label>
                    <Select onValueChange={(value) => updateField("childLevel", value)} required>
                      <SelectTrigger className="h-12 border-2">
                        <SelectValue placeholder="Sélectionner le niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="leger">Léger</SelectItem>
                        <SelectItem value="modere">Modéré</SelectItem>
                        <SelectItem value="severe">Sévère</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {role === "professional" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Spécialité</Label>
                    <Select onValueChange={(value) => updateField("specialty", value)} required>
                      <SelectTrigger className="h-12 border-2">
                        <SelectValue placeholder="Sélectionner votre spécialité" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="orthophoniste">Orthophoniste</SelectItem>
                        <SelectItem value="psychologue">Psychologue</SelectItem>
                        <SelectItem value="ergotherapeute">Ergothérapeute</SelectItem>
                        <SelectItem value="psychomotricien">Psychomotricien</SelectItem>
                        <SelectItem value="educateur">Éducateur spécialisé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Localisation</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => updateField("location", e.target.value)}
                      placeholder="Ville, Tunisie"
                      className="h-12 border-2"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="availability">Disponibilité</Label>
                    <Input
                      id="availability"
                      value={formData.availability}
                      onChange={(e) => updateField("availability", e.target.value)}
                      placeholder="Ex: Lundi-Vendredi 9h-17h"
                      className="h-12 border-2"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Prix par séance (DT)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => updateField("price", e.target.value)}
                      placeholder="50"
                      className="h-12 border-2"
                      required
                    />
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setRole(null)}
                  className="flex-1 h-12 rounded-full"
                >
                  Retour
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-12 bg-blue-500 hover:bg-blue-600 rounded-full"
                >
                  S'inscrire
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Déjà un compte ?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:underline"
              >
                Se connecter
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );}
