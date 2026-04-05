export type UserRole = 'parent' | 'professional';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Child {
  id: string;
  name: string;
  age: number;
  level: string;
}

export interface Activity {
  id: string;
  title: string;
  time: string;
  period: 'morning' | 'afternoon';
  completed: boolean;
  type?: 'emotion' | 'game' | 'exercise' | 'social';
}

export const ACTIVITY_STORAGE_KEY = 'auticare_activities';
const ACTIVITY_PLAN_START_DATE = '2026-04-07';

interface StoredActivitiesPayload {
  date: string;
  activities: Activity[];
}

export interface EmotionEntry {
  id: string;
  date: string;
  emotion: 'happy' | 'sad' | 'angry' | 'calm';
}

export const EMOTION_STORAGE_KEY = 'auticare_emotions';

export interface Professional {
  id: string;
  name: string;
  specialty: string;
  location: string;
  availability: string;
  price: number;
  rating: number;
  reviews: number;
  image?: string;
  email?: string;
}

export interface TherapyRequest {
  id: string;
  parentId: string;
  parentName: string;
  therapyType: string;
  description: string;
  availability: string;
  status: 'pending' | 'accepted' | 'rejected';
  professionalId?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  confirmed?: boolean;
  createdAt: string;
}

export interface Service {
  id: string;
  professionalId: string;
  therapyType: string;
  price: number;
  availability: string;
  description: string;
}

export interface MarketplaceServiceOffer {
  id: string;
  professionalId: string;
  professionalName: string;
  specialty: string;
  location: string;
  availability: string;
  price: number;
  description: string;
  rating: number;
  reviews: number;
  email?: string;
}

export const THERAPY_REQUESTS_UPDATED_EVENT = 'auticare-therapy-requests-updated';
export const THERAPY_REQUESTS_STORAGE_KEY = 'auticare_therapy_requests';
export const MARKETPLACE_SERVICES_STORAGE_KEY = 'auticare_marketplace_services';

// Mock current user - in real app this would come from auth context
export let currentUser: User | null = null;

export const setCurrentUser = (user: User | null) => {
  currentUser = user;
};

const activityTemplates: Omit<Activity, 'completed'>[][] = [
  [
    { id: '1', title: 'Jeu de reconnaissance des émotions', time: '09:00', period: 'morning', type: 'emotion' },
    { id: '2', title: 'Activité de dessin libre', time: '10:00', period: 'morning', type: 'game' },
    { id: '3', title: 'Exercice de motricité fine', time: '11:00', period: 'morning', type: 'exercise' },
    { id: '4', title: 'Jeu de mémoire visuelle', time: '14:00', period: 'afternoon', type: 'game' },
    { id: '5', title: 'Activité sociale : Partage', time: '15:00', period: 'afternoon', type: 'social' },
    { id: '6', title: 'Exercice de concentration', time: '16:00', period: 'afternoon', type: 'exercise' },
    { id: '7', title: 'Jeu cognitif : Puzzles', time: '16:30', period: 'afternoon', type: 'game' },
  ],
  [
    { id: '1', title: 'Cartes des émotions', time: '09:00', period: 'morning', type: 'emotion' },
    { id: '2', title: 'Jeu de tri des couleurs', time: '10:00', period: 'morning', type: 'game' },
    { id: '3', title: 'Atelier de coordination main-oeil', time: '11:00', period: 'morning', type: 'exercise' },
    { id: '4', title: 'Jeu d’association d’images', time: '14:00', period: 'afternoon', type: 'game' },
    { id: '5', title: 'Discussion guidée en duo', time: '15:00', period: 'afternoon', type: 'social' },
    { id: '6', title: 'Respiration et attention', time: '16:00', period: 'afternoon', type: 'exercise' },
    { id: '7', title: 'Mini défi logique', time: '16:30', period: 'afternoon', type: 'game' },
  ],
  [
    { id: '1', title: 'Miroir des expressions', time: '09:00', period: 'morning', type: 'emotion' },
    { id: '2', title: 'Construction libre', time: '10:00', period: 'morning', type: 'game' },
    { id: '3', title: 'Parcours motricité douce', time: '11:00', period: 'morning', type: 'exercise' },
    { id: '4', title: 'Mémoire sonore', time: '14:00', period: 'afternoon', type: 'game' },
    { id: '5', title: 'Jeu de tour de parole', time: '15:00', period: 'afternoon', type: 'social' },
    { id: '6', title: 'Pause sensorielle', time: '16:00', period: 'afternoon', type: 'exercise' },
    { id: '7', title: 'Puzzle narratif', time: '16:30', period: 'afternoon', type: 'game' },
  ],
];

const getLocalDateIso = (date = new Date()) => {
  const timezoneOffsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - timezoneOffsetMs).toISOString().split('T')[0];
};

const getActivityTemplateIndex = (dateIso: string) => {
  const startDate = new Date(`${ACTIVITY_PLAN_START_DATE}T00:00:00`);
  const targetDate = new Date(`${dateIso}T00:00:00`);
  const diffDays = Math.floor((targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  return ((diffDays % activityTemplates.length) + activityTemplates.length) % activityTemplates.length;
};

export const getCurrentActivityPlanProgress = () => {
  const index = getActivityTemplateIndex(getLocalDateIso());
  return {
    dayNumber: index + 1,
    totalDays: activityTemplates.length,
  };
};

const getTemplateForDate = (dateIso: string): Activity[] => {
  const templateIndex = getActivityTemplateIndex(dateIso);

  return activityTemplates[templateIndex].map((activity) => ({
    ...activity,
    completed: false,
  }));
};

export const mockActivities: Activity[] = getTemplateForDate(getLocalDateIso());

export const getStoredActivities = (): Activity[] => {
  if (typeof window === 'undefined') {
    return getTemplateForDate(getLocalDateIso());
  }

  const todayIso = getLocalDateIso();
  const todayTemplate = getTemplateForDate(todayIso);
  const savedActivities = localStorage.getItem(ACTIVITY_STORAGE_KEY);

  if (!savedActivities) {
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify({ date: todayIso, activities: todayTemplate }));
    return todayTemplate;
  }

  try {
    const parsed = JSON.parse(savedActivities) as StoredActivitiesPayload | Activity[];

    // Migrate old storage shape (array only) to date-aware payload.
    if (Array.isArray(parsed)) {
      const completedById = new Map(parsed.map((activity) => [activity.id, activity.completed]));
      const migratedActivities = todayTemplate.map((activity) => ({
        ...activity,
        completed: completedById.get(activity.id) ?? false,
      }));
      localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify({ date: todayIso, activities: migratedActivities }));
      return migratedActivities;
    }

    if (parsed.date !== todayIso) {
      const nextPayload: StoredActivitiesPayload = { date: todayIso, activities: todayTemplate };
      localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(nextPayload));
      return todayTemplate;
    }

    const completedById = new Map(parsed.activities.map((activity) => [activity.id, activity.completed]));
    const normalizedActivities = todayTemplate.map((activity) => ({
      ...activity,
      completed: completedById.get(activity.id) ?? false,
    }));
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify({ date: todayIso, activities: normalizedActivities }));
    return normalizedActivities;
  } catch {
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify({ date: todayIso, activities: todayTemplate }));
    return todayTemplate;
  }
};

export const saveStoredActivities = (activities: Activity[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify({ date: getLocalDateIso(), activities }));
  window.dispatchEvent(new CustomEvent('auticare-activities-updated'));
};

export const resetDailyActivities = (): Activity[] => {
  const resetActivities = getStoredActivities().map((activity) => ({
    ...activity,
    completed: false,
  }));

  saveStoredActivities(resetActivities);
  return resetActivities;
};

export const roundDownToMultipleOf5 = (value: number) => Math.floor(value / 5) * 5;

export const generateProfessionalEmail = (name: string): string => {
  // Remove 'Dr.' or 'Dr' prefix if present
  const cleanName = name.replace(/^Dr\.?\s+/i, '').trim();
  // Replace spaces with dots and convert to lowercase
  const email = cleanName.toLowerCase().replace(/\s+/g, '.');
  return `${email}@email.com`;
};

export const getProfessionalFullInfo = (professionalId: string, professionalName: string) => {
  // Try to find matching professional in mockProfessionals
  const mockPro = mockProfessionals.find(p => 
    p.id === professionalId || p.name.toLowerCase() === professionalName.toLowerCase()
  );

  return {
    email: mockPro?.email || generateProfessionalEmail(professionalName),
    rating: mockPro?.rating ?? 4.8,
    reviews: mockPro?.reviews ?? 0,
    userId: professionalId,
  };
};

export const getStoredMarketplaceServices = (): MarketplaceServiceOffer[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  const hasReset = localStorage.getItem('auticare_marketplace_services_reset_done');
  if (!hasReset) {
    localStorage.setItem(MARKETPLACE_SERVICES_STORAGE_KEY, JSON.stringify([]));
    localStorage.setItem('auticare_marketplace_services_reset_done', 'true');
    return [];
  }

  const savedServices = localStorage.getItem(MARKETPLACE_SERVICES_STORAGE_KEY);
  if (!savedServices) {
    return [];
  }

  const parsedServices = JSON.parse(savedServices) as MarketplaceServiceOffer[];

  // One-time cleanup requested: remove only one Dr. Amira service entry.
  const hasRemovedAmiraService = localStorage.getItem('auticare_removed_one_amira_service');
  if (!hasRemovedAmiraService) {
    const amiraIndex = parsedServices.findIndex((service) =>
      service.professionalName.trim().toLowerCase() === 'dr. amira ben said'
    );

    if (amiraIndex !== -1) {
      const nextServices = parsedServices.filter((_, index) => index !== amiraIndex);
      localStorage.setItem(MARKETPLACE_SERVICES_STORAGE_KEY, JSON.stringify(nextServices));
      localStorage.setItem('auticare_removed_one_amira_service', 'true');
      return nextServices;
    }

    localStorage.setItem('auticare_removed_one_amira_service', 'true');
  }

  return parsedServices;
};

export const saveStoredMarketplaceServices = (services: MarketplaceServiceOffer[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(MARKETPLACE_SERVICES_STORAGE_KEY, JSON.stringify(services));
  window.dispatchEvent(new CustomEvent('auticare-marketplace-updated'));
};

export const syncMarketplaceServicesForProfessional = (professional: {
  id: string;
  name: string;
  location?: string;
  rating?: number;
  reviews?: number;
}, services: Service[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  const existingServices = getStoredMarketplaceServices();
  const remainingServices = existingServices.filter((service) => service.professionalId !== professional.id);

  const profInfo = getProfessionalFullInfo(professional.id, professional.name);

  // Only sync the last (most recently added) service
  const lastService = services[services.length - 1];
  
  const nextServices = lastService ? [
    ...remainingServices,
    {
      id: `${professional.id}-${lastService.id}`,
      professionalId: professional.id,
      professionalName: professional.name,
      specialty: lastService.therapyType,
      location: professional.location ?? 'Tunis',
      availability: lastService.availability,
      price: lastService.price,
      description: lastService.description,
      rating: professional.rating ?? 4.8,
      reviews: professional.reviews ?? 0,
      email: profInfo.email,
    },
  ] : remainingServices;

  saveStoredMarketplaceServices(nextServices);
};

export const clearMarketplaceServicesForProfessional = (professionalId: string) => {
  if (typeof window === 'undefined') {
    return;
  }

  const remainingServices = getStoredMarketplaceServices().filter((service) => service.professionalId !== professionalId);
  saveStoredMarketplaceServices(remainingServices);
};

export const mockProfessionals: Professional[] = [
  {
    id: '1',
    name: 'Dr. Amira Ben Said',
    specialty: 'Orthophoniste',
    location: 'Tunis, Centre-ville',
    availability: 'Lundi - Vendredi',
    price: 40,
    rating: 4.8,
    reviews: 42,
    email: 'amira.bensaid@email.com',
  },
  {
    id: '2',
    name: 'Dr. Karim Gharbi',
    specialty: 'Psychologue',
    location: 'Ariana',
    availability: 'Mardi - Samedi',
    price: 50,
    rating: 4.9,
    reviews: 38,
    email: 'karim.gharbi@email.com',
  },
  {
    id: '3',
    name: 'Dr. Leila Mansour',
    specialty: 'Psychomotricienne',
    location: 'Sousse',
    availability: 'Lundi - Mercredi',
    price: 35,
    rating: 4.7,
    reviews: 31,
    email: 'leila.mansour@email.com',
  },
  {
    id: '4',
    name: 'Dr. Mohamed Bouzid',
    specialty: 'Thérapeute comportemental',
    location: 'Sfax',
    availability: 'Lundi - Vendredi',
    price: 45,
    rating: 4.8,
    reviews: 25,
    email: 'mohamed.bouzid@email.com',
  },
  {
    id: '5',
    name: 'Dr. Ines Khelifi',
    specialty: 'Éducateur spécialisé',
    location: 'Nabeul',
    availability: 'Lundi - Jeudi',
    price: 35,
    rating: 4.9,
    reviews: 19,
    email: 'ines.khelifi@email.com',
  },
];

const defaultTherapyRequests: TherapyRequest[] = [
  {
    id: '1',
    parentId: 'parent1',
    parentName: 'Sarah Hamdi',
    therapyType: 'Orthophonie',
    description: 'Mon enfant a besoin d\'aide pour améliorer sa communication verbale.',
    availability: 'Lundi et Mercredi après-midi',
    status: 'pending',
    createdAt: '2026-04-01T10:00:00Z',
  },
  {
    id: '2',
    parentId: 'parent2',
    parentName: 'Ahmed Trabelsi',
    therapyType: 'Psychomotricité',
    description: 'Besoin d\'exercices pour développer la motricité fine.',
    availability: 'Mardi matin',
    status: 'accepted',
    professionalId: 'prof1',
    scheduledDate: '2026-04-08',
    scheduledTime: '10:00',
    confirmed: false,
    createdAt: '2026-03-30T14:00:00Z',
  },
];

export const getStoredTherapyRequests = (): TherapyRequest[] => {
  if (typeof window === 'undefined') {
    return defaultTherapyRequests;
  }

  const savedRequests = localStorage.getItem(THERAPY_REQUESTS_STORAGE_KEY);

  if (!savedRequests) {
    localStorage.setItem(THERAPY_REQUESTS_STORAGE_KEY, JSON.stringify(defaultTherapyRequests));
    return defaultTherapyRequests;
  }

  try {
    const parsed = JSON.parse(savedRequests) as TherapyRequest[];
    return parsed.map((request) => ({
      ...request,
      confirmed: request.confirmed ?? false,
    }));
  } catch {
    localStorage.setItem(THERAPY_REQUESTS_STORAGE_KEY, JSON.stringify(defaultTherapyRequests));
    return defaultTherapyRequests;
  }
};

export const saveStoredTherapyRequests = (requests: TherapyRequest[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(THERAPY_REQUESTS_STORAGE_KEY, JSON.stringify(requests));
  window.dispatchEvent(new CustomEvent(THERAPY_REQUESTS_UPDATED_EVENT));
};

export let mockTherapyRequests: TherapyRequest[] = getStoredTherapyRequests();

export const addTherapyRequest = (request: Omit<TherapyRequest, 'id' | 'createdAt'>) => {
  const newRequest: TherapyRequest = {
    ...request,
    id: `req-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  mockTherapyRequests = [...mockTherapyRequests, newRequest];
  saveStoredTherapyRequests(mockTherapyRequests);

  return newRequest;
};

export const updateTherapyRequest = (id: string, updates: Partial<TherapyRequest>) => {
  mockTherapyRequests = mockTherapyRequests.map(req => 
    req.id === id ? { ...req, ...updates } : req
  );
  saveStoredTherapyRequests(mockTherapyRequests);
};

export let mockEmotionEntries: EmotionEntry[] = [
  { id: '1', date: '2026-04-01', emotion: 'happy' },
  { id: '2', date: '2026-04-02', emotion: 'calm' },
  { id: '3', date: '2026-04-03', emotion: 'sad' },
  { id: '4', date: '2026-04-04', emotion: 'happy' },
];

export const getStoredEmotionEntries = (): EmotionEntry[] => {
  if (typeof window === 'undefined') {
    return mockEmotionEntries;
  }

  const savedEntries = localStorage.getItem(EMOTION_STORAGE_KEY);
  return savedEntries ? JSON.parse(savedEntries) as EmotionEntry[] : mockEmotionEntries;
};

export const saveStoredEmotionEntries = (entries: EmotionEntry[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(EMOTION_STORAGE_KEY, JSON.stringify(entries));
  window.dispatchEvent(new CustomEvent('auticare-emotions-updated'));
};

export const addEmotionEntry = (emotion: EmotionEntry['emotion']) => {
  const newEntry: EmotionEntry = {
    id: `emotion-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    emotion,
  };

  const nextEntries = [...getStoredEmotionEntries(), newEntry];
  mockEmotionEntries = nextEntries;
  saveStoredEmotionEntries(nextEntries);

  return newEntry;
};

export const mockGameScores = {
  emotionRecognition: [
    { date: '2026-03-28', score: 60 },
    { date: '2026-03-30', score: 70 },
    { date: '2026-04-01', score: 80 },
    { date: '2026-04-03', score: 85 },
    { date: '2026-04-04', score: 90 },
  ],
  memory: [
    { date: '2026-03-28', score: 50 },
    { date: '2026-03-30', score: 65 },
    { date: '2026-04-01', score: 70 },
    { date: '2026-04-03', score: 75 },
    { date: '2026-04-04', score: 85 },
  ],
  concentration: [
    { date: '2026-03-28', score: 55 },
    { date: '2026-03-30', score: 60 },
    { date: '2026-04-01', score: 75 },
    { date: '2026-04-03', score: 80 },
    { date: '2026-04-04', score: 88 },
  ],
};
