import { Link } from "react-router";
import { FileText, Calendar, DollarSign, Users } from "lucide-react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { getStoredTherapyRequests } from "../../../lib/mockData";

export function ProfessionalDashboard() {
  const therapyRequests = getStoredTherapyRequests();
  const pendingRequests = therapyRequests.filter(r => r.status === 'pending');
  const acceptedRequests = therapyRequests.filter(r => r.status === 'accepted');
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          Tableau de bord professionnel
        </h1>
        <p className="text-gray-600">Gérez vos services et demandes</p>
      </div>
      
      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-700">Demandes reçues</p>
              <p className="text-2xl font-bold text-blue-900">{pendingRequests.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-700">Sessions prévues</p>
              <p className="text-2xl font-bold text-green-900">{acceptedRequests.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-purple-700">Patients actifs</p>
              <p className="text-2xl font-bold text-purple-900">8</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-orange-700">Revenus ce mois</p>
              <p className="text-2xl font-bold text-orange-900">1,200 TND</p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="p-8 hover:shadow-lg transition-shadow border-blue-100">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
              <FileText className="w-7 h-7 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Demandes des parents</h3>
              <p className="text-gray-600 mb-4">
                {pendingRequests.length} nouvelle{pendingRequests.length !== 1 ? 's' : ''} demande{pendingRequests.length !== 1 ? 's' : ''} en attente
              </p>
              <Link to="/professional/requests">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl">
                  Voir les demandes
                </Button>
              </Link>
            </div>
          </div>
        </Card>
        
        <Card className="p-8 hover:shadow-lg transition-shadow border-green-100">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
              <Calendar className="w-7 h-7 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Mes services</h3>
              <p className="text-gray-600 mb-4">Gérer mes offres et disponibilités</p>
              <Link to="/professional/services">
                <Button className="bg-green-500 hover:bg-green-600 text-white rounded-xl">
                  Gérer mes services
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card className="p-6 border-blue-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Activité récente</h2>
        
        <div className="space-y-3">
          {pendingRequests.slice(0, 3).map((request) => (
            <div key={request.id} className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
              <FileText className="w-5 h-5 text-blue-600 mt-1" />
              <div className="flex-1">
                <p className="font-medium text-gray-800">Nouvelle demande : {request.therapyType}</p>
                <p className="text-sm text-gray-600">De {request.parentName}</p>
              </div>
              <Link to="/professional/requests">
                <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
                  Voir
                </Button>
              </Link>
            </div>
          ))}
          
          {pendingRequests.length === 0 && (
            <div className="text-center py-8 text-gray-600">
              Aucune nouvelle activité
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
