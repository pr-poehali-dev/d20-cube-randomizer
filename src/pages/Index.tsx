import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface DiceResult {
  id: string;
  type: 'd6' | 'd20';
  value: number;
  timestamp: Date;
  isCritical: boolean;
}

interface Dice {
  id: string;
  type: 'd6' | 'd20';
  value: number;
  isRolling: boolean;
}

const Index = () => {
  const [diceList, setDiceList] = useState<Dice[]>([
    { id: '1', type: 'd20', value: 20, isRolling: false }
  ]);
  const [rollHistory, setRollHistory] = useState<DiceResult[]>([]);

  const addDice = (type: 'd6' | 'd20') => {
    const newDice: Dice = {
      id: Date.now().toString(),
      type,
      value: type === 'd6' ? 6 : 20,
      isRolling: false
    };
    setDiceList([...diceList, newDice]);
  };

  const removeDice = (id: string) => {
    if (diceList.length > 1) {
      setDiceList(diceList.filter(dice => dice.id !== id));
    }
  };

  const rollDice = (id: string) => {
    const dice = diceList.find(d => d.id === id);
    if (!dice || dice.isRolling) return;

    // Start rolling animation
    setDiceList(prev => prev.map(d => 
      d.id === id ? { ...d, isRolling: true } : d
    ));

    // Simulate rolling animation
    setTimeout(() => {
      const maxValue = dice.type === 'd6' ? 6 : 20;
      const newValue = Math.floor(Math.random() * maxValue) + 1;
      const isCritical = (dice.type === 'd6' && newValue === 6) || 
                        (dice.type === 'd20' && (newValue === 1 || newValue === 20));

      setDiceList(prev => prev.map(d => 
        d.id === id ? { ...d, value: newValue, isRolling: false } : d
      ));

      // Add to history
      const result: DiceResult = {
        id: Date.now().toString(),
        type: dice.type,
        value: newValue,
        timestamp: new Date(),
        isCritical
      };
      setRollHistory(prev => [result, ...prev.slice(0, 19)]);
    }, 800);
  };

  const rollAllDice = () => {
    const rollingDice = diceList.filter(d => d.isRolling);
    if (rollingDice.length > 0) return;

    // Start rolling animation for all dice
    setDiceList(prev => prev.map(d => ({ ...d, isRolling: true })));

    // Simulate rolling animation
    setTimeout(() => {
      const newResults: DiceResult[] = [];
      
      setDiceList(prev => prev.map(d => {
        const maxValue = d.type === 'd6' ? 6 : 20;
        const newValue = Math.floor(Math.random() * maxValue) + 1;
        const isCritical = (d.type === 'd6' && newValue === 6) || 
                          (d.type === 'd20' && (newValue === 1 || newValue === 20));

        // Add to results
        newResults.push({
          id: Date.now().toString() + d.id,
          type: d.type,
          value: newValue,
          timestamp: new Date(),
          isCritical
        });

        return { ...d, value: newValue, isRolling: false };
      }));

      // Add all results to history
      setRollHistory(prev => [...newResults, ...prev.slice(0, 20 - newResults.length)]);
    }, 800);
  };

  const removeAllDice = () => {
    setDiceList([{ id: Date.now().toString(), type: 'd20', value: 20, isRolling: false }]);
  };

  const renderDiceFace = (dice: Dice) => {
    const size = dice.type === 'd6' ? 'w-20 h-20' : 'w-24 h-24';
    const textSize = dice.type === 'd6' ? 'text-2xl' : 'text-3xl';
    
    return (
      <div className="relative group">
        <div
          className={`
            dice-face cursor-pointer ${size} ${textSize} font-bold
            ${dice.isRolling ? 'dice-rolling' : ''}
            ${dice.value === (dice.type === 'd6' ? 6 : 20) || dice.value === 1 ? 'critical-result' : ''}
            transition-all duration-200 hover:scale-105
          `}
          onClick={() => rollDice(dice.id)}
        >
          <span className="text-primary font-bold">
            {dice.isRolling ? '?' : dice.value}
          </span>
          <div className="absolute -top-2 -right-2 text-xs font-semibold text-muted-foreground">
            {dice.type.toUpperCase()}
          </div>
        </div>
        
        {diceList.length > 1 && (
          <button
            onClick={() => removeDice(dice.id)}
            className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ×
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Merriweather' }}>
            🎲 Мистические Кубики 🎲
          </h1>
          <p className="text-muted-foreground">
            Магический набор для настольных RPG приключений
          </p>
        </div>

        {/* Dice Area */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-6 justify-center items-center mb-6">
            {diceList.map(dice => (
              <div key={dice.id}>
                {renderDiceFace(dice)}
              </div>
            ))}
          </div>

          {/* Roll All Controls */}
          <div className="flex gap-4 justify-center mb-4">
            <Button 
              onClick={rollAllDice}
              className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
              disabled={diceList.some(d => d.isRolling)}
            >
              <Icon name="Dices" size={16} />
              Бросить все кубики
            </Button>
            <Button 
              onClick={removeAllDice}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Icon name="Trash2" size={16} />
              Убрать все кубики
            </Button>
          </div>

          {/* Add Dice Controls */}
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => addDice('d6')}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90"
            >
              <Icon name="Plus" size={16} />
              Добавить d6
            </Button>
            <Button 
              onClick={() => addDice('d20')}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90"
            >
              <Icon name="Plus" size={16} />
              Добавить d20
            </Button>
          </div>
        </div>

        {/* History */}
        {rollHistory.length > 0 && (
          <Card className="bg-card/70 border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="History" size={20} />
                <h2 className="text-xl font-semibold" style={{ fontFamily: 'Merriweather' }}>
                  История бросков
                </h2>
              </div>
              
              <div className="grid gap-3 max-h-64 overflow-y-auto">
                {rollHistory.map((result, index) => (
                  <div 
                    key={result.id}
                    className={`
                      history-item flex items-center justify-between
                      ${result.isCritical ? 'border-primary bg-primary/10' : ''}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground">
                        {result.type.toUpperCase()}
                      </span>
                      <span className={`
                        text-2xl font-bold 
                        ${result.isCritical ? 'text-primary' : 'text-foreground'}
                      `}>
                        {result.value}
                      </span>
                      {result.isCritical && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                          {result.value === 1 ? 'КРИТИЧЕСКИЙ ПРОВАЛ' : 'КРИТИЧЕСКИЙ УСПЕХ'}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {result.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>🎯 Кликните по кубику, чтобы бросить его</p>
          <p>✨ Критические результаты подсвечиваются магическим сиянием</p>
        </div>
      </div>
    </div>
  );
};

export default Index;