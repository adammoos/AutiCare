import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

interface ReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  professionalName: string;
  professionalId: string;
  onSubmit: (rating: number, comment: string) => void;
}

export function ReviewDialog({
  isOpen,
  onClose,
  professionalName,
  onSubmit,
}: ReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error('Veuillez sélectionner une note');
      return;
    }

    onSubmit(rating, comment);
    toast.success('Merci pour votre avis ! ⭐');
    setRating(0);
    setComment('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Laisser un avis
          </DialogTitle>
          <DialogDescription>
            Partagez votre expérience avec {professionalName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="text-center">
            <p className="text-sm font-medium mb-3">Note</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {rating === 5 && 'Excellent !'}
                {rating === 4 && 'Très bien'}
                {rating === 3 && 'Bien'}
                {rating === 2 && 'Moyen'}
                {rating === 1 && 'Peut mieux faire'}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Commentaire
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partagez votre expérience (optionnel)..."
              className="resize-none"
              rows={4}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="w-full bg-gradient-to-r from-blue-500 to-green-400 hover:from-blue-600 hover:to-green-500"
          >
            Publier l'avis
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
