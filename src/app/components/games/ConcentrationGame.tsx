import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ArrowLeft, Sparkles, Star, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";

type Shape = {
  id: number;
  type: "circle" | "square" | "triangle";
  color: string;
  x: number;
  y: number;
  isTarget: boolean;
};

const colors = ["red", "blue", "green", "yellow", "purple"];
const shapeTypes: Shape["type"][] = ["circle", "square", "triangle"];

export function ConcentrationGame() {
  const navigate = useNavigate();
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [targetShape, setTargetShape] = useState<{ type: Shape["type"]; color: string } | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
      setGameComplete(true);
    }
  }, [timeLeft, isPlaying]);

  const generateShapes = () => {
    const targetType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    const targetColor = colors[Math.floor(Math.random() * colors.length)];
    setTargetShape({ type: targetType, color: targetColor });

    const newShapes: Shape[] = [];
    // Add 1-2 target shapes
    const targetCount = Math.random() > 0.5 ? 2 : 1;
    for (let i = 0; i < targetCount; i++) {
      newShapes.push({
        id: newShapes.length,
        type: targetType,
        color: targetColor,
        x: Math.random() * 80 + 5,
        y: Math.random() * 70 + 10,
        isTarget: true,
      });
    }

    // Add distractor shapes
    for (let i = 0; i < 8; i++) {
      const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      if (type !== targetType || color !== targetColor) {
        newShapes.push({
          id: newShapes.length,
          type,
          color,
          x: Math.random() * 80 + 5,
          y: Math.random() * 70 + 10,
          isTarget: false,
        });
      }
    }

    setShapes(newShapes.sort(() => Math.random() - 0.5));
  };

  const startGame = () => {
    setScore(0);
    setRound(0);
    setTimeLeft(30);
    setIsPlaying(true);
    setGameComplete(false);
    generateShapes();
  };

  const resetGame = () => {
    setScore(0);
    setRound(0);
    setTimeLeft(30);
    setIsPlaying(true);
    setGameComplete(false);
    generateShapes();
  };

  const handleShapeClick = (shape: Shape) => {
    if (!isPlaying) return;

    if (shape.isTarget) {
      setScore(prev => prev + 10);
      confetti({
        particleCount: 20,
        spread: 40,
        origin: { y: 0.6 }
      });
      
      // Remove clicked shape
      setShapes(prev => prev.filter(s => s.id !== shape.id));
      
      // Check if all targets found
      const remainingTargets = shapes.filter(s => s.isTarget && s.id !== shape.id);
      if (remainingTargets.length === 0) {
        setRound(prev => prev + 1);
        setTimeout(() => generateShapes(), 500);
      }
    } else {
      setScore(prev => Math.max(0, prev - 5));
    }
  };

  const getShapeStyle = (shape: Shape) => {
    const baseStyle = {
      position: "absolute" as const,
      left: `${shape.x}%`,
      top: `${shape.y}%`,
      width: "60px",
      height: "60px",
      cursor: isPlaying ? "pointer" : "default",
      transition: "transform 0.2s",
    };

    return baseStyle;
  };

  const renderShape = (shape: Shape) => {
    const colorMap: Record<string, string> = {
      red: "#ef4444",
      blue: "#3b82f6",
      green: "#22c55e",
      yellow: "#eab308",
      purple: "#a855f7",
    };

    
    if (shape.type === "circle") {
      return (
        <div
          key={shape.id}
          style={getShapeStyle(shape)}
          onClick={() => handleShapeClick(shape)}
          className="hover:scale-110 transition-transform"
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              backgroundColor: colorMap[shape.color],
              border: "3px solid white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          />
        </div>
      );
    } else if (shape.type === "square") {
      return (
        <div
          key={shape.id}
          style={getShapeStyle(shape)}
          onClick={() => handleShapeClick(shape)}
          className="hover:scale-110 transition-transform"
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: colorMap[shape.color],
              border: "3px solid white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          />
        </div>
      );
    } else {
      return (
        <div
          key={shape.id}
          style={getShapeStyle(shape)}
          onClick={() => handleShapeClick(shape)}
          className="hover:scale-110 transition-transform"
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "30px solid transparent",
              borderRight: "30px solid transparent",
              borderBottom: `52px solid ${colorMap[shape.color]}`,
              filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.2))",
            }}
          />
        </div>
      );
    }
  };

  const getColorName = (color: string) => {
    const names: Record<string, string> = {
      red: "rouge",
      blue: "bleu",
      green: "vert",
      yellow: "jaune",
      purple: "violet",
    };
    return names[color];
  };

  const getShapeName = (type: Shape["type"]) => {
    const names: Record<Shape["type"], string> = {
      circle: "cercle",
      square: "carré",
      triangle: "triangle",
    };
    return names[type];
  };

  const finalScore = Math.min(100, Math.max(0, score));

  if (gameComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="p-12 max-w-lg w-full text-center border-yellow-200 bg-gradient-to-br from-yellow-50 to-white">
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-12 h-12 ${
                  i < Math.ceil((finalScore / 100) * 5)
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
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
          onClick={() => navigate('/parent/games')}
          variant="ghost"
          className="mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour
        </Button>
          <div>
            <h1 className="text-3xl text-blue-600">Jeu de concentration</h1>
            <p className="text-gray-600">Trouve les bonnes formes !</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 justify-center">
          <Card className="border-2 border-blue-200">
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-gray-600">Score</p>
              <p className="text-3xl">{score}</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-green-200">
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-gray-600">Niveau</p>
              <p className="text-3xl">{round}</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-orange-200">
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-gray-600">Temps</p>
              <p className="text-3xl">{timeLeft}s</p>
            </CardContent>
          </Card>
        </div>

        {/* Game Area */}
        <Card className="border-2 border-blue-100">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardTitle className="text-center text-2xl">
              {!isPlaying && timeLeft === 30 ? (
                "Clique sur Commencer pour jouer"
              ) : !isPlaying && timeLeft === 0 ? (
                `🎉 Partie terminée ! Score final : ${score}`
              ) : targetShape ? (
                `Trouve le ${getShapeName(targetShape.type)} ${getColorName(targetShape.color)}`
              ) : (
                "Chargement..."
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8">
            <div
              className="relative bg-gradient-to-br from-cyan-50 to-blue-100 rounded-2xl border-4 border-blue-200"
              style={{ height: "500px" }}
            >
              {shapes.map(shape => renderShape(shape))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4">
          {(!isPlaying || timeLeft === 0) && (
            <Button
              onClick={startGame}
              className="gap-2 bg-blue-500 hover:bg-blue-600 px-8 py-6 text-lg"
            >
              <Sparkles className="w-5 h-5" />
              {timeLeft === 30 ? "Commencer" : "Rejouer"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
