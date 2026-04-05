import { Outlet, useLocation } from "react-router";
import { ParentNavigation } from "./ParentNavigation";
import { ProfessionalNavigation } from "./ProfessionalNavigation";
import { currentUser } from "../../lib/mockData";

export function RootLayout() {
  const location = useLocation();
  
  // Don't show navigation on landing, login, signup pages
  const noNavPages = ['/', '/login', '/signup'];
  const showNav = !noNavPages.includes(location.pathname);
  
  // Determine which navigation to show based on current path
  const isParentRoute = location.pathname.startsWith('/parent');
  const isProfessionalRoute = location.pathname.startsWith('/professional');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {showNav && isParentRoute && <ParentNavigation />}
      {showNav && isProfessionalRoute && <ProfessionalNavigation />}
      
      <main className={showNav ? "pt-16" : ""}>
        <Outlet />
      </main>
    </div>
  );
}
