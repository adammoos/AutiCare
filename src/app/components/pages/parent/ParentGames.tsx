import { Link } from "react-router";
import { Smile, Brain, Target } from "lucide-react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";

export function ParentGames() {
  const games = [
    {
      id: 'emotion-recognition',
      title: 'Reconnaissance des émotions',
      description: 'Apprendre à identifier les différentes émotions',
      icon: Smile,
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      path: '/parent/games/emotion-recognition',
    },
    {
      id: 'memory',
      title: 'Jeu de mémoire',
      description: 'Améliorer la mémoire avec des cartes à retourner',
      icon: Brain,
      color: 'from-purple-400 to-pink-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      path: '/parent/games/memory',
    },
    {
      id: 'concentration',
      title: 'Jeu de concentration',
      description: 'Développer l\'attention et la concentration',
      icon: Target,
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      path: '/parent/games/concentration',
    },
  ];
  
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Jeux éducatifs</h1>
        <p className="text-gray-600">Des activités ludiques pour développer les compétences</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {games.map((game) => {
          const Icon = game.icon;
          
          return (
            <Card 
              key={game.id}
              className={`p-8 ${game.bgColor} border-2 ${game.borderColor} hover:shadow-xl transition-all`}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${game.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                {game.title}
              </h3>
              
              <p className="text-gray-600 mb-6">
                {game.description}
              </p>
              
              <Link to={game.path}>
                <Button className={`w-full bg-gradient-to-r ${game.color} text-white rounded-xl hover:shadow-md transition-all`}>
                  Commencer
                </Button>
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
