import { Link, useLocation } from "react-router";
import { Home, Calendar, Gamepad2, Users, FileText, TrendingUp, LogOut, Bell } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";

export function ParentNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const navItems = [
    { path: '/parent/dashboard', icon: Home, label: 'Accueil' },
    { path: '/parent/program', icon: Calendar, label: 'Programme' },
    { path: '/parent/games', icon: Gamepad2, label: 'Jeux' },
    { path: '/parent/marketplace', icon: Users, label: 'Thérapeutes' },
    { path: '/parent/requests', icon: FileText, label: 'Demandes' },
    { path: '/parent/notifications', icon: Bell, label: 'Notifications' },
    { path: '/parent/progress', icon: TrendingUp, label: 'Progression' },
  ];
  
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-blue-100 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-400 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">A</span>
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              AutiCare
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                              (item.path === '/parent/games' && location.pathname.startsWith('/parent/games'));
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden md:inline text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
          
          <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden md:inline text-sm font-medium">Déconnexion</span>
            </button>
        </div>
      </div>
    </nav>
  );
}