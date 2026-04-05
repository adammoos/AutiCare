import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Star, RotateCcw } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

type Emotion = 'happy' | 'sad' | 'angry' | 'surprised';

interface Question {
  emotion: Emotion;
  emoji: string;
  options: { emotion: Emotion; label: string; emoji: string }[];
}

const questions: Question[] = [
  {
    emotion: 'happy',
    emoji: '😊',
    options: [
      { emotion: 'happy', label: 'Heureux', emoji: '😊' },
      { emotion: 'sad', label: 'Triste', emoji: '😢' },
      { emotion: 'angry', label: 'En colère', emoji: '😠' },
    ],
  },
  {
    emotion: 'sad',
    emoji: '😢',
    options: [
      { emotion: 'angry', label: 'En colère', emoji: '😠' },
      { emotion: 'sad', label: 'Triste', emoji: '😢' },
      { emotion: 'happy', label: 'Heureux', emoji: '😊' },
    ],
  },
  {
    emotion: 'angry',
    emoji: '😠',
    options: [
      { emotion: 'surprised', label: 'Surpris', emoji: '😮' },
      { emotion: 'happy', label: 'Heureux', emoji: '😊' },
      { emotion: 'angry', label: 'En colère', emoji: '😠' },
    ],
  },
  {
    emotion: 'surprised',
    emoji: '😮',
    options: [
      { emotion: 'sad', label: 'Triste', emoji: '😢' },
      { emotion: 'surprised', label: 'Surpris', emoji: '😮' },
      { emotion: 'angry', label: 'En colère', emoji: '😠' },
    ],
  },
];

export function EmotionRecognitionGame() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<Emotion | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  
  const question = questions[currentQuestion];
  
  const handleAnswer = (emotion: Emotion) => {
    setSelectedAnswer(emotion);
    setShowFeedback(true);
    
    if (emotion === question.emotion) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        setGameComplete(true);
      }
    }, 1500);
  };
  
  const resetGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setGameComplete(false);
  };
  
  const finalScore = Math.round((score / questions.length) * 100);
  
  if (gameComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="p-12 max-w-lg w-full text-center border-yellow-200 bg-gradient-to-br from-yellow-50 to-white">
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-12 h-12 ${
                  i < Math.ceil(score / questions.length * 5)
                    ? 'text-yellow-500 fill-yellow-500'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Bravo ! 🎉</h2>
          <p className="text-xl mb-2 text-gray-700">Tu as terminé le jeu !</p>
          <p className="text-5xl font-bold mb-8 text-yellow-600">{finalScore}%</p>
          
          <div className="space-y-3">
            <Button
              onClick={resetGame}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl h-12"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Rejouer
            </Button>
            
            <Button
              onClick={() => navigate('/parent/games')}
              variant="outline"
              className="w-full border-2 border-gray-300 rounded-xl h-12"
            >
              Retour aux jeux
            </Button>
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <Button
          onClick={() => navigate('/parent/games')}
          variant="ghost"
          className="mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour
        </Button>
        
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Reconnaissance des émotions</h1>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold text-gray-700">{score}/{questions.length}</span>
          </div>
        </div>
        
        <div className="mt-4 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>
      
      <Card className="p-12 text-center border-yellow-200 bg-gradient-to-br from-yellow-50 to-white">
        <p className="text-lg text-gray-700 mb-8">Comment se sent cette personne ?</p>
        
        <div className="text-9xl mb-12">
          {question.emoji}
        </div>
        
        <div className="grid gap-4">
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option.emotion;
            const isCorrect = option.emotion === question.emotion;
            const showAsCorrect = showFeedback && isCorrect;
            const showAsWrong = showFeedback && isSelected && !isCorrect;
            
            return (
              <button
                key={option.emotion}
                onClick={() => !showFeedback && handleAnswer(option.emotion)}
                disabled={showFeedback}
                className={`p-6 rounded-2xl border-2 text-lg font-semibold transition-all ${
                  showAsCorrect
                    ? 'bg-green-100 border-green-500 text-green-800'
                    : showAsWrong
                    ? 'bg-red-100 border-red-500 text-red-800'
                    : 'bg-white border-gray-300 hover:border-yellow-500 hover:bg-yellow-50 text-gray-800'
                } disabled:cursor-not-allowed`}
              >
                <span className="text-4xl mr-3">{option.emoji}</span>
                {option.label}
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
