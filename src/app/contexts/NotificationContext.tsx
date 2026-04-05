import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

export type NotificationType = 'request' | 'response' | 'session' | 'message';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  relatedId?: string;
  contactInfo?: string;
  actionLabel?: string;
  actionHref?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const parentDefaultNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'response',
    title: 'Nouvelle réponse de thérapeute',
    message: 'Dr. Amira Ben Salem a accepté votre demande de séance',
    contactInfo: 'Voir le suivi de votre demande dans la section Demandes.',
    actionLabel: 'Aller aux demandes',
    actionHref: '/parent/requests',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: 'notif-2',
    type: 'session',
    title: 'Nouvelle activité disponible',
    message: 'Un nouveau jeu de reconnaissance des couleurs est disponible',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: 'notif-3',
    type: 'session',
    title: 'Conférence sur l\'autisme',
    message: 'Une nouvelle conférence interactive sur les stratégies de communication est maintenant disponible',
    contactInfo: 'Contact: conference@auticare.tn | +216 71 234 567',
    actionLabel: 'Voir la conférence',
    actionHref: '/parent/conference',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: 'notif-4',
    type: 'request',
    title: 'Formation pour les parents',
    message: 'Accédez à notre nouvelle formation en ligne sur la gestion comportementale et le développement de l\'autisme',
    contactInfo: 'Contact: formation@auticare.tn | +216 71 234 890',
    actionLabel: 'Ouvrir la formation',
    actionHref: '/parent/training',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
];

const professionalDefaultNotifications: Notification[] = [
  {
    id: 'pro-notif-1',
    type: 'request',
    title: 'Nouvelle demande : Orthophonie',
    message: 'De Sarah Hamdi',
    contactInfo: 'Un parent a envoyé une nouvelle demande de thérapie à examiner.',
    actionLabel: 'Voir',
    actionHref: '/professional/requests',
    createdAt: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: 'pro-notif-2',
    type: 'session',
    title: 'Conférence professionnelle',
    message: 'Vous avez une conférence le samedi 19 avril 2026 à 09h30.',
    contactInfo: 'Thème : stratégies d’accompagnement et communication avec les parents.',
    actionLabel: 'Voir l’agenda',
    actionHref: '/professional/dashboard',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: 'pro-notif-3',
    type: 'message',
    title: 'Nouvelle offre de thérapie',
    message: 'Votre offre "Thérapie comportementale" est maintenant visible par les parents.',
    contactInfo: 'Consultez vos services pour gérer la disponibilité ou le prix.',
    actionLabel: 'Voir mes offres',
    actionHref: '/professional/services',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: 'pro-notif-4',
    type: 'message',
    title: 'Rappel de demande en attente',
    message: 'Une demande d’évaluation reste à traiter dans vos demandes professionnelles.',
    contactInfo: 'Répondez ou refusez depuis la page Demandes.',
    actionLabel: 'Voir les demandes',
    actionHref: '/professional/dashboard',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: false,
  },
];

const getDefaultNotifications = (role?: string) => (
  role === 'professional' ? professionalDefaultNotifications : parentDefaultNotifications
);

const getNotificationStorageKey = (userId?: string, role?: string) => {
  if (!userId) {
    return null;
  }

  if (role === 'professional') {
    return `notifications_${userId}_professional_v3`;
  }

  return `notifications_${userId}_parent`;
};

const notificationsMatchSeed = (saved: Notification[], seed: Notification[]) => {
  if (saved.length !== seed.length) {
    return false;
  }

  return seed.every((seedNotification, index) => {
    const savedNotification = saved[index];

    return (
      savedNotification?.title === seedNotification.title &&
      savedNotification?.message === seedNotification.message &&
      savedNotification?.actionHref === seedNotification.actionHref &&
      savedNotification?.type === seedNotification.type
    );
  });
};

const hasWrongRoleNotifications = (notifications: Notification[], role?: string) => {
  if (role === 'parent') {
    return notifications.some((notification) => notification.actionHref?.startsWith('/professional'));
  }

  if (role === 'professional') {
    return notifications.some((notification) => notification.actionHref?.startsWith('/parent'));
  }

  return false;
};

const loadNotifications = (userId?: string, role?: string) => {
  if (typeof window === 'undefined') {
    return getDefaultNotifications(role);
  }

  const storageKey = getNotificationStorageKey(userId, role);
  const saved = storageKey ? localStorage.getItem(storageKey) : null;

  if (saved) {
    const parsed = JSON.parse(saved) as Notification[];

    if (parsed.length > 0) {
      const defaultNotifications = getDefaultNotifications(role);

      if (hasWrongRoleNotifications(parsed, role)) {
        if (storageKey) {
          localStorage.setItem(storageKey, JSON.stringify(defaultNotifications));
        }
        return defaultNotifications;
      }

      if (role === 'professional' && !notificationsMatchSeed(parsed, defaultNotifications)) {
        if (storageKey) {
          localStorage.setItem(storageKey, JSON.stringify(defaultNotifications));
        }
        return defaultNotifications;
      }

      return parsed;
    }
  }

  if (storageKey) {
    const defaultNotifications = getDefaultNotifications(role);
    localStorage.setItem(storageKey, JSON.stringify(defaultNotifications));
    return defaultNotifications;
  }

  return getDefaultNotifications(role);
};

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    return loadNotifications(user?.id, user?.role);
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const storageKey = getNotificationStorageKey(user?.id, user?.role);
    const defaultNotifications = getDefaultNotifications(user?.role);

    if (hasWrongRoleNotifications(notifications, user?.role)) {
      setNotifications(defaultNotifications);
      return;
    }

    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(notifications));
    }
  }, [notifications, user]);

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
