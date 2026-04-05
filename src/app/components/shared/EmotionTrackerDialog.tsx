import { useState } from 'react';
import { Smile, Frown, Angry, Meh } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { addEmotionEntry } from '../../lib/mockData';
import { toast } from 'sonner';

interface EmotionTrackerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  activityName: string;
}

const emotions = [
  { value: 'happy' as const, label: 'Heureux', icon: Smile, color: 'bg-green-100 text-green-600 hover:bg-green-200' },
  { value: 'sad' as const, label: 'Triste', icon: Frown, color: 'bg-blue-100 text-blue-600 hover:bg-blue-200' },
  { value: 'angry' as const, label: 'Stressé', icon: Angry, color: 'bg-red-100 text-red-600 hover:bg-red-200' },
  { value: 'calm' as const, label: 'Calme', icon: Meh, color: 'bg-purple-100 text-purple-600 hover:bg-purple-200' },
];

export function EmotionTrackerDialog({ isOpen, onClose, activityName }: EmotionTrackerDialogProps) {
  const [selectedEmotion, setSelectedEmotion] = useState<'happy' | 'sad' | 'angry' | 'calm' | null>(null);
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (selectedEmotion) {
      addEmotionEntry(selectedEmotion);
      toast.success('État émotionnel enregistré ! 😊');
      setSelectedEmotion(null);
      setNotes('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Comment va votre enfant ?
          </DialogTitle>
          <DialogDescription className="text-center">
            Après l'activité : <span className="font-semibold">{activityName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            {emotions.map((emotion) => {
              const Icon = emotion.icon;
              return (
                <button
                  key={emotion.value}
                  onClick={() => setSelectedEmotion(emotion.value)}
                  className={`flex flex-col items-center gap-3 p-6 rounded-2xl transition-all ${
                    emotion.color
                  } ${
                    selectedEmotion === emotion.value
                      ? 'ring-4 ring-blue-500 scale-105'
                      : ''
                  }`}
                >
                  <Icon className="w-12 h-12" />
                  <span className="font-semibold">{emotion.label}</span>
                </button>
              );
            })}
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Notes (optionnel)
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ajoutez des notes sur le comportement de votre enfant..."
              className="resize-none"
              rows={3}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!selectedEmotion}
            className="w-full bg-gradient-to-r from-blue-500 to-green-400 hover:from-blue-600 hover:to-green-500"
          >
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
