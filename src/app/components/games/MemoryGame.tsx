import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Star, RotateCcw } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

interface CardType {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

const createCards = (): CardType[] => {
  const cards = [...emojis, ...emojis].map((emoji, index) => ({
    id: index,
    emoji,
    isFlipped: false,
    isMatched: false,
  }));
  
  // Shuffle cards
  return cards.sort(() => Math.random() - 0.5);
};

export function MemoryGame() {
  const navigate = useNavigate();
  const [cards, setCards] = useState<CardType[]>(createCards());
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      const firstCard = cards.find(c => c.id === first);
      const secondCard = cards.find(c => c.id === second);
      
      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        // Match found
        setTimeout(() => {
          setCards(prev => 
            prev.map(card => 
              card.id === first || card.id === second
                ? { ...card, isMatched: true }
                : card
            )
          );
          setMatchedPairs(prev => prev + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => 
            prev.map(card => 
              card.id === first || card.id === second
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
      
      setMoves(prev => prev + 1);
    }
  }, [flippedCards, cards]);
  
  useEffect(() => {
    if (matchedPairs === emojis.length) {
      setTimeout(() => setGameComplete(true), 500);
    }
  }, [matchedPairs]);
  
  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2) return;
    
    const card = cards.find(c => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;
    
    setCards(prev => 
      prev.map(c => c.id === id ? { ...c, isFlipped: true } : c)
    );
    setFlippedCards(prev => [...prev, id]);
  };
  
  const resetGame = () => {
    setCards(createCards());
    setFlippedCards([]);
    setMoves(0);
    setMatchedPairs(0);
    setGameComplete(false);
  };
  
  const score = Math.max(100 - moves * 2, 0);
  
  if (gameComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="p-12 max-w-lg w-full text-center border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-12 h-12 ${
                  i < Math.ceil((score / 100) * 5)
                    ? 'text-purple-500 fill-purple-500'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Excellent travail ! 🎉</h2>
          <p className="text-xl mb-2 text-gray-700">Tu as trouvé toutes les paires !</p>
          <p className="text-gray-600 mb-2">Nombre de coups : {moves}</p>
          <p className="text-5xl font-bold mb-8 text-purple-600">{score}%</p>
          
          <div className="space-y-3">
            <Button
              onClick={resetGame}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-xl h-12"
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
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
          <h1 className="text-2xl font-bold text-gray-800">Jeu de mémoire</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Coups:</span>
              <span className="font-semibold text-gray-700">{moves}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Paires:</span>
              <span className="font-semibold text-gray-700">{matchedPairs}/{emojis.length}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`aspect-square rounded-2xl text-6xl flex items-center justify-center transition-all transform ${
              card.isFlipped || card.isMatched
                ? 'bg-white border-2 border-purple-300'
                : 'bg-gradient-to-br from-purple-400 to-pink-500 hover:scale-105'
            } ${card.isMatched ? 'opacity-50' : ''}`}
          >
            {card.isFlipped || card.isMatched ? card.emoji : '?'}
          </button>
        ))}
      </div>
    </div>
  );
}
