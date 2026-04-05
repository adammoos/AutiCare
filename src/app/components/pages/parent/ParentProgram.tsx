import { useMemo, useState } from "react";
import { Sun, Moon, CheckCircle2, Circle, Brain, Dumbbell, Users, Heart, Smile, Frown, Angry, Meh } from "lucide-react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { EmotionTrackerDialog } from "../../shared/EmotionTrackerDialog";
import { addEmotionEntry, getCurrentActivityPlanProgress, getStoredActivities, resetDailyActivities, saveStoredActivities } from "../../../lib/mockData";
import type { Activity } from "../../../lib/mockData";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";

type Emotion = 'happy' | 'sad' | 'angry' | 'calm';

export function ParentProgram() {
  const [activities, setActivities] = useState(getStoredActivities());
  const todayLabel = useMemo(() => format(new Date(), 'EEEE d MMMM yyyy', { locale: fr }), []);
  const activityPlanProgress = useMemo(() => getCurrentActivityPlanProgress(), []);
  const [emotionDialogOpen, setEmotionDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [emotionSaved, setEmotionSaved] = useState(false);

  const emotions: { value: Emotion; icon: any; label: string; color: string }[] = [
    { value: 'happy', icon: Smile, label: 'Heureux', color: 'bg-green-100 text-green-600 hover:bg-green-200 border-green-300' },
    { value: 'sad', icon: Frown, label: 'Triste', color: 'bg-blue-100 text-blue-600 hover:bg-blue-200 border-blue-300' },
    { value: 'angry', icon: Angry, label: 'Stressé', color: 'bg-red-100 text-red-600 hover:bg-red-200 border-red-300' },
    { value: 'calm', icon: Meh, label: 'Calme', color: 'bg-purple-100 text-purple-600 hover:bg-purple-200 border-purple-300' },
  ];

  const handleSaveEmotion = () => {
    if (selectedEmotion) {
      addEmotionEntry(selectedEmotion);
      setEmotionSaved(true);
      setTimeout(() => setEmotionSaved(false), 3000);
    }
  };

  const handleResetProgram = () => {
    const resetActivities = resetDailyActivities();
    setActivities(resetActivities);
    toast.success('Programme du jour réinitialisé');
  };
  
  const handleCompleteActivity = (id: string, title: string) => {
    setActivities((prev: Activity[]) => {
      const nextActivities = prev.map(activity => 
        activity.id === id 
          ? { ...activity, completed: true }
          : activity
      );

      saveStoredActivities(nextActivities);
      return nextActivities;
    });
    // Ouvrir le dialogue d'émotion après avoir complété une activité
    setSelectedActivity(title);
    setEmotionDialogOpen(true);
  };
  
  const morningActivities = activities.filter((a: Activity) => a.period === 'morning');
  const afternoonActivities = activities.filter((a: Activity) => a.period === 'afternoon');
  
  const getActivityIcon = (type?: Activity['type']) => {
    switch (type) {
      case 'emotion': return Heart;
      case 'game': return Brain;
      case 'exercise': return Dumbbell;
      case 'social': return Users;
      default: return Brain;
    }
  };
  
  const getActivityColor = (type?: Activity['type']) => {
    switch (type) {
      case 'emotion': return 'bg-pink-100 text-pink-600';
      case 'game': return 'bg-purple-100 text-purple-600';
      case 'exercise': return 'bg-blue-100 text-blue-600';
      case 'social': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Emotional Check-in */}
      <Card className="p-6 mb-8 border-purple-100 bg-gradient-to-br from-purple-50 to-white">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Comment était l'état émotionnel de l'enfant aujourd'hui ?
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {emotions.map((emotion) => {
            const Icon = emotion.icon;
            const isSelected = selectedEmotion === emotion.value;
            
            return (
              <button
                key={emotion.value}
                onClick={() => setSelectedEmotion(emotion.value)}
                className={`p-4 rounded-2xl border-2 transition-all ${emotion.color} ${
                  isSelected ? 'ring-4 ring-purple-300 scale-105' : ''
                }`}
              >
                <Icon className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium text-sm">{emotion.label}</p>
              </button>
            );
          })}
        </div>
        
        <Button
          onClick={handleSaveEmotion}
          disabled={!selectedEmotion}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-xl h-12 disabled:opacity-50"
        >
          {emotionSaved ? '✓ Enregistré !' : 'Enregistrer'}
        </Button>
      </Card>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Programme du jour</h1>
        <p className="text-gray-600">{todayLabel}</p>
        <p className="text-sm text-blue-600 mt-1">
          Plan du jour : Jour {activityPlanProgress.dayNumber}/{activityPlanProgress.totalDays}
        </p>
        <div className="mt-4">
          <Button
            variant="outline"
            onClick={handleResetProgram}
            className="rounded-xl border-red-200 text-red-600 hover:bg-red-50"
          >
            Réinitialiser le programme du jour
          </Button>
        </div>
      </div>
      
      {/* Morning Activities */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
            <Sun className="w-6 h-6 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">Matin</h2>
        </div>
        
        <div className="space-y-3">
          {morningActivities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            const colorClass = getActivityColor(activity.type);
            
            return (
              <Card 
                key={activity.id} 
                className={`p-5 border-2 transition-all ${
                  activity.completed 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <button
                    onClick={() => !activity.completed && handleCompleteActivity(activity.id, activity.title)}
                    className="flex-shrink-0"
                  >
                    {activity.completed ? (
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    ) : (
                      <Circle className="w-8 h-8 text-gray-400" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <h3 className={`font-semibold ${
                      activity.completed ? 'text-green-800 line-through' : 'text-gray-800'
                    }`}>
                      {activity.title}
                    </h3>
                    <p className="text-sm text-gray-600">{activity.time}</p>
                  </div>
                  
                  {!activity.completed && (
                    <Button
                      onClick={() => handleCompleteActivity(activity.id, activity.title)}
                      className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
                    >
                      Terminé
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
      
      {/* Afternoon Activities */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <Moon className="w-6 h-6 text-orange-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">Après-midi</h2>
        </div>
        
        <div className="space-y-3">
          {afternoonActivities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            const colorClass = getActivityColor(activity.type);
            
            return (
              <Card 
                key={activity.id} 
                className={`p-5 border-2 transition-all ${
                  activity.completed 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <button
                    onClick={() => !activity.completed && handleCompleteActivity(activity.id, activity.title)}
                    className="flex-shrink-0"
                  >
                    {activity.completed ? (
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    ) : (
                      <Circle className="w-8 h-8 text-gray-400" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <h3 className={`font-semibold ${
                      activity.completed ? 'text-green-800 line-through' : 'text-gray-800'
                    }`}>
                      {activity.title}
                    </h3>
                    <p className="text-sm text-gray-600">{activity.time}</p>
                  </div>
                  
                  {!activity.completed && (
                    <Button
                      onClick={() => handleCompleteActivity(activity.id, activity.title)}
                      className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
                    >
                      Terminé
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <EmotionTrackerDialog
        isOpen={emotionDialogOpen}
        onClose={() => setEmotionDialogOpen(false)}
        activityName={selectedActivity}
      />
    </div>
  );
}