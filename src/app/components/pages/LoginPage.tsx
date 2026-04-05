import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Mail, Lock, Heart, UserCircle, Stethoscope } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useAuth, UserRole } from "../../contexts/AuthContext";
import { toast } from "sonner";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>('parent');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password, selectedRole);
      toast.success('Connexion réussie ! 🎉');
      
      // Rediriger selon le rôle
      if (selectedRole === 'parent') {
        navigate('/parent/dashboard');
      } else {
        navigate('/professional/dashboard');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-green-400 rounded-2xl mb-4 shadow-lg">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              Connexion
            </span>
          </h1>
          <p className="text-gray-600">Bienvenue sur AutiCare</p>
        </div>
        
        <div className="bg-white rounded-3xl shadow-lg p-8 border border-blue-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="text-gray-700 mb-3 block">
                Se connecter en tant que :
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole('parent')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    selectedRole === 'parent'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <UserCircle className={`w-8 h-8 ${selectedRole === 'parent' ? 'text-blue-500' : 'text-gray-400'}`} />
                  <span className={`font-semibold ${selectedRole === 'parent' ? 'text-blue-600' : 'text-gray-600'}`}>
                    Parent
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('professional')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    selectedRole === 'professional'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <Stethoscope className={`w-8 h-8 ${selectedRole === 'professional' ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className={`font-semibold ${selectedRole === 'professional' ? 'text-green-600' : 'text-gray-600'}`}>
                    Professionnel
                  </span>
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-700 mb-2 block">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="pl-11 h-12 rounded-xl border-gray-200"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="password" className="text-gray-700 mb-2 block">
                Mot de passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-11 h-12 rounded-xl border-gray-200"
                  required
                />
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-green-400 hover:from-blue-600 hover:to-green-500 text-white rounded-xl text-lg shadow-md"
            >
              Se connecter
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Pas encore de compte ?{' '}
              <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}