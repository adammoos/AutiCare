import { useState } from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Calendar } from '../ui/calendar';
import { fr } from 'date-fns/locale';
import { format } from 'date-fns';

interface SessionBookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: Date, time: string) => void;
  professionalName: string;
  availableDates?: string[];
}

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
];

export function SessionBookingDialog({
  isOpen,
  onClose,
  onConfirm,
  professionalName,
  availableDates = []
}: SessionBookingDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>('');

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onConfirm(selectedDate, selectedTime);
      setSelectedDate(undefined);
      setSelectedTime('');
      onClose();
    }
  };

  // Disable dates in the past and optionally filter by available dates
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) return true;
    
    if (availableDates.length > 0) {
      const dateStr = format(date, 'yyyy-MM-dd');
      return !availableDates.includes(dateStr);
    }
    
    return false;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Réserver une séance avec {professionalName}
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 py-4">
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-blue-500" />
              Choisissez une date
            </h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={isDateDisabled}
              locale={fr}
              className="rounded-md border"
            />
          </div>

          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Choisissez un créneau
            </h3>
            <div className="grid grid-cols-3 gap-2 max-h-[350px] overflow-y-auto">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? 'default' : 'outline'}
                  className={selectedTime === time ? 'bg-blue-500 hover:bg-blue-600' : ''}
                  onClick={() => setSelectedTime(time)}
                  disabled={!selectedDate}
                >
                  {time}
                </Button>
              ))}
            </div>
            {!selectedDate && (
              <p className="text-sm text-gray-500 mt-4">
                Sélectionnez d'abord une date
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedDate || !selectedTime}
            className="bg-gradient-to-r from-blue-500 to-green-400 hover:from-blue-600 hover:to-green-500"
          >
            Confirmer la réservation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
