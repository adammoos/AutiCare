import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'parent' | 'professional';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  specialty?: string;
  location?: string;
  price?: number;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  signup: (data: Omit<User, 'id'> & { password: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_PROFESSIONALS: Record<string, Pick<User, 'name' | 'specialty' | 'location' | 'price' | 'phone'>> = {
  adammoosbusiness: {
    name: 'Dr. Amira Ben Said',
    specialty: 'Orthophoniste',
    location: 'Tunis, Centre-ville',
    price: 40,
    phone: '+216 20 123 456',
  },
};

const DEMO_PARENTS: Record<string, Pick<User, 'name'>> = {
  'sarah.hamadi': {
    name: 'Sarah Hamdi',
  },
  'sarah.hamdi': {
    name: 'Sarah Hamdi',
  },
  adammoosyou1: {
    name: 'Sarah Hamdi',
  },
};

const getEmailLocalPart = (email: string) => email.split('@')[0].trim().toLowerCase();

const sanitizeForId = (value: string) => value.replace(/[^a-z0-9_-]/gi, '-').toLowerCase();

const buildDemoUser = (email: string, role: UserRole): User => {
  const localPart = getEmailLocalPart(email);
  const stableId = `${role}-${sanitizeForId(localPart || 'demo-user')}`;

  if (role === 'parent') {
    const demoParent = DEMO_PARENTS[localPart];

    if (demoParent) {
      return {
        id: stableId,
        email,
        role,
        name: demoParent.name,
      };
    }
  }

  if (role === 'professional') {
    const demoProfessional = DEMO_PROFESSIONALS[localPart];

    if (demoProfessional) {
      return {
        id: stableId,
        email,
        role,
        name: demoProfessional.name,
        specialty: demoProfessional.specialty,
        location: demoProfessional.location,
        price: demoProfessional.price,
        phone: demoProfessional.phone,
      };
    }
  }

  return {
    id: stableId,
    name: localPart || 'demo-user',
    email,
    role,
  };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('auticare_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email: string, password: string, role: UserRole) => {
    // Simulation de connexion
    const mockUser: User = buildDemoUser(email, role);
    
    setUser(mockUser);
    localStorage.setItem('auticare_user', JSON.stringify(mockUser));

    // Keep marketplace profile aligned with known professional demo accounts.
    if (mockUser.role === 'professional' && mockUser.specialty && mockUser.location && mockUser.price) {
      const professionals = JSON.parse(localStorage.getItem('professionals') || '[]');
      const filtered = professionals.filter((professional: { id?: string }) => professional.id !== mockUser.id);

      filtered.push({
        id: mockUser.id,
        name: mockUser.name,
        specialty: mockUser.specialty,
        location: mockUser.location,
        availability: 'Lundi - Vendredi, 9h-17h',
        price: mockUser.price,
        phone: mockUser.phone,
        rating: 5.0,
        reviews: 0,
      });

      localStorage.setItem('professionals', JSON.stringify(filtered));
    }
  };

  const signup = async (data: Omit<User, 'id'> & { password: string }) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      specialty: data.specialty,
      location: data.location,
      price: data.price,
    };
    
    // Si c'est un professionnel, l'ajouter à la liste des professionnels
    if (newUser.role === 'professional' && newUser.specialty && newUser.location && newUser.price) {
      const professionals = JSON.parse(localStorage.getItem('professionals') || '[]');
      professionals.push({
        id: newUser.id,
        name: newUser.name,
        specialty: newUser.specialty,
        location: newUser.location,
        availability: 'Lundi - Vendredi',
        price: newUser.price,
        rating: 5.0,
        reviews: 0,
        reviewsList: [],
      });
      localStorage.setItem('professionals', JSON.stringify(professionals));
    }
    
    setUser(newUser);
    localStorage.setItem('auticare_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auticare_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
