import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  userId: string;
  userName: string;
  lastMessage?: string;
  unreadCount: number;
}

interface MessagingContextType {
  conversations: Conversation[];
  getMessages: (otherUserId: string) => Message[];
  sendMessage: (receiverId: string, receiverName: string, content: string) => void;
  markAsRead: (otherUserId: string) => void;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export function MessagingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(`messages_${user?.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(`messages_${user.id}`, JSON.stringify(messages));
    }
  }, [messages, user]);

  const getMessages = (otherUserId: string) => {
    if (!user) return [];
    return messages.filter(
      m => (m.senderId === user.id && m.receiverId === otherUserId) ||
           (m.senderId === otherUserId && m.receiverId === user.id)
    ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };

  const sendMessage = (receiverId: string, receiverName: string, content: string) => {
    if (!user) return;
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      receiverId,
      content,
      createdAt: new Date().toISOString(),
      read: false,
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const markAsRead = (otherUserId: string) => {
    if (!user) return;
    setMessages(prev => prev.map(m => 
      m.senderId === otherUserId && m.receiverId === user.id 
        ? { ...m, read: true } 
        : m
    ));
  };

  const conversations: Conversation[] = [];
  if (user) {
    const userIds = new Set<string>();
    messages.forEach(m => {
      if (m.senderId === user.id) userIds.add(m.receiverId);
      if (m.receiverId === user.id) userIds.add(m.senderId);
    });

    userIds.forEach(userId => {
      const userMessages = getMessages(userId);
      const lastMessage = userMessages[userMessages.length - 1];
      const unreadCount = userMessages.filter(m => m.senderId === userId && !m.read).length;
      
      conversations.push({
        userId,
        userName: lastMessage?.senderId === userId ? lastMessage.senderName : 'Utilisateur',
        lastMessage: lastMessage?.content,
        unreadCount,
      });
    });
  }

  return (
    <MessagingContext.Provider value={{ conversations, getMessages, sendMessage, markAsRead }}>
      {children}
    </MessagingContext.Provider>
  );
}

export function useMessaging() {
  const context = useContext(MessagingContext);
  if (context === undefined) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
}
