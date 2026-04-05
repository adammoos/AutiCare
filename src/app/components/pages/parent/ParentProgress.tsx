import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card } from "../../ui/card";
import { TrendingUp, Smile, Gamepad2 } from "lucide-react";
import { mockGameScores, mockEmotionEntries } from "../../../lib/mockData";

export function ParentProgress() {
  // Calculate emotion distribution
  const emotionCounts = mockEmotionEntries.reduce((acc, entry) => {
    acc[entry.emotion] = (acc[entry.emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const emotionData = Object.entries(emotionCounts).map(([emotion, count]) => ({
    name: emotion === 'happy' ? 'Heureux' : 
          emotion === 'sad' ? 'Triste' : 
          emotion === 'angry' ? 'En colère' : 'Calme',
    value: count,
  }));
  
  const EMOTION_COLORS = {
    'Heureux': '#FCD34D',
    'Triste': '#60A5FA',
    'En colère': '#F87171',
    'Calme': '#34D399',
  };
  
  // Combine game scores for overview
  const gameProgressData = mockGameScores.emotionRecognition.map((item, index) => ({
    date: item.date.split('-')[2] + '/' + item.date.split('-')[1],
    emotions: item.score,
    memoire: mockGameScores.memory[index]?.score || 0,
    concentration: mockGameScores.concentration[index]?.score || 0,
  }));
  
  const averageScores = {
    emotions: Math.round(mockGameScores.emotionRecognition.reduce((sum, s) => sum + s.score, 0) / mockGameScores.emotionRecognition.length),
    memory: Math.round(mockGameScores.memory.reduce((sum, s) => sum + s.score, 0) / mockGameScores.memory.length),
    concentration: Math.round(mockGameScores.concentration.reduce((sum, s) => sum + s.score, 0) / mockGameScores.concentration.length),
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Suivi de progression</h1>
        <p className="text-gray-600">Analysez l'évolution et les progrès de votre enfant</p>
      </div>
      
      {/* Average Scores */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <Smile className="w-6 h-6 text-yellow-600" />
            <h3 className="font-semibold text-gray-800">Émotions</h3>
          </div>
          <p className="text-4xl font-bold text-yellow-700">{averageScores.emotions}%</p>
          <p className="text-sm text-yellow-700 mt-1">Score moyen</p>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <Gamepad2 className="w-6 h-6 text-purple-600" />
            <h3 className="font-semibold text-gray-800">Mémoire</h3>
          </div>
          <p className="text-4xl font-bold text-purple-700">{averageScores.memory}%</p>
          <p className="text-sm text-purple-700 mt-1">Score moyen</p>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Concentration</h3>
          </div>
          <p className="text-4xl font-bold text-blue-700">{averageScores.concentration}%</p>
          <p className="text-sm text-blue-700 mt-1">Score moyen</p>
        </Card>
      </div>
      
      {/* Game Progress Chart */}
      <Card className="p-6 mb-8 border-blue-100">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Évolution des scores de jeux</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={gameProgressData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="date" 
              stroke="#6B7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6B7280"
              style={{ fontSize: '12px' }}
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '12px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="emotions" 
              stroke="#FCD34D" 
              strokeWidth={3}
              name="Émotions"
              dot={{ fill: '#FCD34D', r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="memoire" 
              stroke="#A78BFA" 
              strokeWidth={3}
              name="Mémoire"
              dot={{ fill: '#A78BFA', r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="concentration" 
              stroke="#60A5FA" 
              strokeWidth={3}
              name="Concentration"
              dot={{ fill: '#60A5FA', r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Emotion Distribution */}
        <Card className="p-6 border-purple-100">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Répartition des émotions</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={emotionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {emotionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={EMOTION_COLORS[entry.name as keyof typeof EMOTION_COLORS]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        
        {/* Latest Scores */}
        <Card className="p-6 border-green-100">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Derniers scores</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { 
                name: 'Émotions', 
                score: mockGameScores.emotionRecognition[mockGameScores.emotionRecognition.length - 1].score,
                fill: '#FCD34D'
              },
              { 
                name: 'Mémoire', 
                score: mockGameScores.memory[mockGameScores.memory.length - 1].score,
                fill: '#A78BFA'
              },
              { 
                name: 'Concentration', 
                score: mockGameScores.concentration[mockGameScores.concentration.length - 1].score,
                fill: '#60A5FA'
              },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="name" 
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              />
              <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                {[
                  { name: 'Émotions', fill: '#FCD34D' },
                  { name: 'Mémoire', fill: '#A78BFA' },
                  { name: 'Concentration', fill: '#60A5FA' },
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
