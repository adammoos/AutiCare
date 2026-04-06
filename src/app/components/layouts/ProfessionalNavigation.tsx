import { Link, useLocation, useNavigate } from "react-router";
import { LayoutDashboard, Briefcase, FileText, User, LogOut, Bell, Menu, X } from "lucide-react";
import { useState } from "react";

export function ProfessionalNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    navigate('/');
  };
  
  const navItems = [
    { path: '/professional/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
    { path: '/professional/services', icon: Briefcase, label: 'Services' },
    { path: '/professional/requests', icon: FileText, label: 'Demandes' },
    { path: '/professional/notifications', icon: Bell, label: 'Notifications' },
    { path: '/professional/profile', icon: User, label: 'Profil' },
  ];
  
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-blue-100 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-400 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">A</span>
              </div>
              <span className="hidden sm:inline text-xl font-semibold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                AutiCare Pro
              </span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
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
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
            
            {/* Mobile/Tablet Nav Items (Icon only) */}
            <div className="flex lg:hidden items-center gap-0.5">
              {navItems.slice(0, 4).map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-center p-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-500'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                );
              })}
            </div>
            
            {/* Logout and Mobile Menu */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-500 transition-colors text-sm"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden lg:inline font-medium">Déconnexion</span>
              </button>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed top-16 left-0 right-0 bg-white border-b border-blue-100 z-40 lg:hidden">
          <div className="max-w-7xl mx-auto px-2 py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 px-3 py-2 w-full text-gray-600 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
