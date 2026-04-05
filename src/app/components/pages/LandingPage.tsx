import { useNavigate } from "react-router";
import { Link } from 'react-router';
import { Heart, Users, Stethoscope, Gamepad2, TrendingUp, Shield, ArrowRight } from 'lucide-react';
import { Button } from "../ui/button";

export function LandingPage() {
  const navigate = useNavigate();
  
  return (
  
    <div className="min-h-screen">
      {/* Hero Section */}  
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-6">
              {/*logo*/}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-400 rounded-2xl flex items-center justify-center shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            {/* Title and Description */}
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                AutiCare
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto">
              Plateforme d'accompagnement pour les enfants autistes en Tunisie
            </p>
            
            <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
              Un espace simple, accessible et adapté pour les parents et les professionnels
            </p>
            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => navigate('/signup')}
                className="bg-gradient-to-r from-blue-500 to-green-400 hover:from-blue-600 hover:to-green-500 text-white px-8 py-6 text-lg rounded-2xl shadow-lg"
              >
                Commencer
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              {/* Login Button */}
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/login')}
                className="border-2 border-blue-300 text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg rounded-2xl"
              >
                Se connecter
              </Button>

            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Nos fonctionnalités
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Espace Parent</h3>
            <p className="text-gray-600">
              Suivez la progression de votre enfant, accédez à des activités personnalisées et gérez les séances thérapeutiques.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Stethoscope className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Professionnels</h3>
            <p className="text-gray-600">
              Proposez vos services, gérez vos rendez-vous et accompagnez les familles dans leur parcours.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Gamepad2 className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Jeux éducatifs</h3>
            <p className="text-gray-600">
              Des jeux adaptés pour développer les compétences sociales et émotionnelles de votre enfant.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Suivi de progression</h3>
            <p className="text-gray-600">
              Visualisez l'évolution de votre enfant grâce à des graphiques et statistiques claires.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-pink-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Suivi émotionnel</h3>
            <p className="text-gray-600">
              Enregistrez et suivez l'état émotionnel quotidien de votre enfant pour mieux comprendre ses besoins.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-cyan-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Plateforme sécurisée</h3>
            <p className="text-gray-600">
              Vos données sont protégées et accessibles uniquement par vous et les professionnels autorisés.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-3xl p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Rejoignez AutiCare et offrez à votre enfant l'accompagnement qu'il mérite.
          </p>
          <Link
            to="/signup"
            className="inline-block bg-white text-blue-500 px-8 py-4 rounded-lg font-medium text-lg hover:bg-gray-100 transition-colors"
          >
            Créer un compte gratuitement
          </Link>
        </div>
      </div>
    </div>
  );
}
