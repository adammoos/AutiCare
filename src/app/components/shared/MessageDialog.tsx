import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { useMessaging } from '../../contexts/MessagingContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MessageDialogProps {
  recipientId: string;
  recipientName: string;
  triggerButton?: React.ReactNode;
}

export function MessageDialog({ recipientId, recipientName, triggerButton }: MessageDialogProps) {
  const { user } = useAuth();
  const { getMessages, sendMessage, markAsRead } = useMessaging();
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const messages = getMessages(recipientId);

  useEffect(() => {
    if (isOpen) {
      markAsRead(recipientId);
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [isOpen, messages.length, recipientId, markAsRead]);

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(recipientId, recipientName, message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button size="sm" variant="outline" className="gap-2">
            <MessageCircle className="w-4 h-4" />
            Message
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle>Conversation avec {recipientName}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                Aucun message. Commencez la conversation !
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      msg.senderId === user?.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.senderId === user?.id ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {formatDistanceToNow(new Date(msg.createdAt), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tapez votre message..."
              className="flex-1"
            />
            <Button onClick={handleSend} size="icon" className="bg-blue-500 hover:bg-blue-600">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
