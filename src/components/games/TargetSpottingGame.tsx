import React, { useState, useEffect, useRef } from 'react';
import { LanguageCode } from '../../types';
import { Volume2, VolumeX, Check } from 'lucide-react';
import { getTargetSpottingStrings } from '../../utils/gameLocalization';
import { bhashiniVoice } from '../../utils/bhashiniVoice';

interface TargetSpottingGameProps {
  currentLanguage: LanguageCode;
  onFinish: (score: number, message: string) => void;
}

interface ColorDef {
  name: string;
  hex: string;
}

interface ShapeDef {
  name: 'circle' | 'square' | 'triangle';
  plural: string;
}

const colors: ColorDef[] = [
  { name: 'red', hex: '#d9614c' },
  { name: 'blue', hex: '#3f7ea6' },
  { name: 'yellow', hex: '#e3b23c' },
  { name: 'green', hex: '#4f8f6d' },
  { name: 'purple', hex: '#8a6b9e' },
  { name: 'orange', hex: '#d98a45' },
];

const shapeTypes: ShapeDef[] = [
  { name: 'circle', plural: 'circles' },
  { name: 'square', plural: 'squares' },
  { name: 'triangle', plural: 'triangles' },
];

const levels = {
  easy: { total: 6, targets: 2, attr: 'color', label: 'Easy', sub: '6 · match color' },
  medium: { total: 8, targets: 3, attr: 'shape', label: 'Medium', sub: '8 · match shape' },
  hard: { total: 9, targets: 3, attr: 'both', label: 'Hard', sub: '9 · match both' },
};

const totalRounds = 5;

const explainerScript =
  "This game is called Target and Color Spotting. Some shapes are shown on the screen. Find the ones that match. Tap only those shapes. Take your time. You can look as long as you like. Let's begin.";

export const TargetSpottingGame: React.FC<TargetSpottingGameProps> = ({
  currentLanguage,
  onFinish,
}) => {
  const tGame = getTargetSpottingStrings(currentLanguage);
  const [levelKey, setLevelKey] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState<'idle' | 'playing' | 'success' | 'complete'>('idle');
  const [foundNum, setFoundNum] = useState(0);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [wrongIndices, setWrongIndices] = useState<number[]>([]);

  // Current Round State
  const [currentRound, setCurrentRound] = useState<{
    items: {
      shape: 'circle' | 'square' | 'triangle';
      colorName: string;
      isTarget: boolean;
      found: boolean;
    }[];
    attr: string;
    colorName: string;
    colorHex: string;
    shapeName: 'circle' | 'square' | 'triangle';
    shapePlural: string;
    targetCount: number;
  } | null>(null);

  const wrongTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Text-To-Speech Explainer
  const setVoiceState = (playing: boolean) => {
    setIsVoicePlaying(playing);
  };

  const speakScript = () => {
    bhashiniVoice.speak(tGame.explainer, currentLanguage);
    setVoiceState(true);
  };

  const stopScript = () => {
    bhashiniVoice.stop();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setVoiceState(false);
  };

  const toggleVoice = () => {
    if (isVoicePlaying) {
      stopScript();
    } else {
      speakScript();
    }
  };

  useEffect(() => {
    return () => {
      stopScript();
      if (wrongTimeoutRef.current) clearTimeout(wrongTimeoutRef.current);
    };
  }, []);

  const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  const buildRound = (lvl: 'easy' | 'medium' | 'hard') => {
    const cfg = levels[lvl];
    const targetColor = pick(colors);
    const targetShape = pick(shapeTypes);
    const items: {
      shape: 'circle' | 'square' | 'triangle';
      colorName: string;
      isTarget: boolean;
      found: boolean;
    }[] = [];

    for (let i = 0; i < cfg.targets; i++) {
      items.push({
        shape: cfg.attr === 'shape' || cfg.attr === 'both' ? targetShape.name : pick(shapeTypes).name,
        colorName: cfg.attr === 'color' || cfg.attr === 'both' ? targetColor.name : pick(colors).name,
        isTarget: true,
        found: false,
      });
    }

    while (items.length < cfg.total) {
      const s = pick(shapeTypes).name;
      const c = pick(colors);
      const matchesShape = s === targetShape.name;
      const matchesColor = c.name === targetColor.name;
      let invalid = false;
      if (cfg.attr === 'color' && matchesColor) invalid = true;
      if (cfg.attr === 'shape' && matchesShape) invalid = true;
      if (cfg.attr === 'both' && matchesShape && matchesColor) invalid = true;
      if (invalid) continue;
      items.push({ shape: s, colorName: c.name, isTarget: false, found: false });
    }

    // Shuffle
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }

    return {
      items,
      attr: cfg.attr,
      colorName: targetColor.name,
      colorHex: targetColor.hex,
      shapeName: targetShape.name,
      shapePlural: targetShape.plural,
      targetCount: cfg.targets,
    };
  };

  const startRound = (lvl: 'easy' | 'medium' | 'hard', rNum: number) => {
    setPhase('playing');
    setFoundNum(0);
    setWrongIndices([]);
    const newR = buildRound(lvl);
    setCurrentRound(newR);
  };

  const handleStart = () => {
    stopScript();
    setRound(1);
    startRound(levelKey, 1);
  };

  const handleContinue = () => {
    if (round >= totalRounds) {
      setPhase('complete');
      onFinish(95, "Wonderful! You've spotted all targets today.");
    } else {
      const nextR = round + 1;
      setRound(nextR);
      startRound(levelKey, nextR);
    }
  };

  const handleLevelChange = (lvl: 'easy' | 'medium' | 'hard') => {
    setLevelKey(lvl);
    setRound(1);
    setPhase('idle');
    setCurrentRound(null);
    setFoundNum(0);
    setWrongIndices([]);
  };

  const handleTileClick = (idx: number) => {
    if (phase !== 'playing' || !currentRound) return;
    const item = currentRound.items[idx];
    if (item.found) return;

    if (item.isTarget) {
      const updatedItems = [...currentRound.items];
      updatedItems[idx] = { ...item, found: true };
      const nextFound = foundNum + 1;
      setFoundNum(nextFound);
      setCurrentRound({ ...currentRound, items: updatedItems });

      if (nextFound === currentRound.targetCount) {
        setPhase('success');
      }
    } else {
      setWrongIndices(prev => [...prev, idx]);
      wrongTimeoutRef.current = setTimeout(() => {
        setWrongIndices(prev => prev.filter(i => i !== idx));
      }, 350);
    }
  };

  const getColorHex = (name: string) => colors.find(c => c.name === name)?.hex || '#d9614c';

  const renderShapeSvg = (shape: 'circle' | 'square' | 'triangle', hex: string, size = 46) => {
    if (shape === 'circle') {
      return (
        <svg width={size} height={size} viewBox="0 0 56 56" className="shape">
          <circle cx="28" cy="28" r="24" fill={hex} />
        </svg>
      );
    }
    if (shape === 'square') {
      return (
        <svg width={size} height={size} viewBox="0 0 56 56" className="shape">
          <rect x="6" y="6" width="44" height="44" rx="10" fill={hex} />
        </svg>
      );
    }
    return (
      <svg width={size} height={size} viewBox="0 0 56 56" className="shape">
        <polygon points="28,6 50,48 6,48" fill={hex} />
      </svg>
    );
  };

  const getInstructionText = () => {
    if (!currentRound) return tGame.roundCount(1, totalRounds);
    const localizedColor = tGame.colors[currentRound.colorName] || currentRound.colorName;
    const localizedShape = tGame.shapes[currentRound.shapeName] || currentRound.shapeName;
    const localizedShapePlural = tGame.shapes[currentRound.shapePlural] || currentRound.shapePlural;
    if (currentRound.attr === 'color') return tGame.findPromptColor(localizedColor);
    if (currentRound.attr === 'shape') return tGame.findPromptShape(localizedShapePlural);
    return tGame.findPromptBoth(localizedColor, localizedShapePlural);
  };

  return (
    <div className="space-y-4">
      {/* Eyebrow & Heading */}
      <div>
        <div className="text-[10px] font-bold tracking-widest uppercase text-[#8B8677]">
          Smriti
        </div>
        <h2 className="text-xl font-display font-bold text-[#1A3C34] mt-0.5">
          {tGame.findPromptShape(tGame.shapes.circle || 'shapes').split(' ')[0] || 'Target Spotting'}
        </h2>
      </div>

      {/* Voice Explainer Button */}
      <button
        onClick={toggleVoice}
        className={`w-full py-3 px-4 rounded-full font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-xs ${
          isVoicePlaying
            ? 'bg-[#1A3C34] text-[#F5C242]'
            : 'bg-[#F5C242] hover:bg-[#e6b338] text-[#16332C]'
        }`}
        aria-label="Explain this game audio instructions"
      >
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
            isVoicePlaying ? 'bg-[#F5C242]/20 animate-pulse' : 'bg-[#16332C]/15'
          }`}
        >
          {isVoicePlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </div>
        <span>{isVoicePlaying ? 'Stop' : 'Voice Explainer'}</span>
      </button>

      {/* Level Tabs */}
      <div className="flex gap-2">
        {(['easy', 'medium', 'hard'] as const).map(lvl => (
          <button
            key={lvl}
            onClick={() => handleLevelChange(lvl)}
            className={`flex-1 py-2 px-1 rounded-2xl border text-center transition-all ${
              levelKey === lvl
                ? 'bg-[#F5C242] border-[#F5C242] text-[#16332C] shadow-xs'
                : 'bg-[#FFFCF2] border-[#eadfb8] text-[#1A3C34] hover:bg-white'
            }`}
          >
            <div className="text-xs font-bold">{tGame.levels[lvl]}</div>
            <div className={`text-[9.5px] mt-0.5 font-medium ${levelKey === lvl ? 'text-[#5c4413]' : 'text-[#8B8677]'}`}>
              {lvl === 'easy' ? 'Level 1' : lvl === 'medium' ? 'Level 2' : 'Level 3'}
            </div>
          </button>
        ))}
      </div>

      {/* Status Row & Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-bold text-[#8B8677]">
          <span>{tGame.roundCount(Math.min(round, totalRounds), totalRounds)}</span>
          <span className="text-[#1A3C34]">
            {phase === 'idle'
              ? '...'
              : phase === 'playing'
              ? tGame.foundCount(foundNum, currentRound?.targetCount || 1)
              : phase === 'success'
              ? tGame.roundSuccess
              : tGame.gameOver}
          </span>
        </div>
        <div className="h-2 bg-[#f3e6bd] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#F5C242] rounded-full transition-all duration-300"
            style={{ width: `${((Math.min(round, totalRounds) - (phase === 'complete' ? 0 : 1)) / totalRounds) * 100}%` }}
          />
        </div>
      </div>

      {/* Instruction Card with Sample Tile */}
      <div className="bg-[#FFFCF2] border border-[#eadfb8] rounded-2xl p-3.5 flex items-center gap-3.5 shadow-xs">
        <div className="w-13 h-13 rounded-xl bg-[#FFF9E8] flex items-center justify-center shrink-0 border border-[#eadfb8]/60">
          {currentRound ? (
            currentRound.attr === 'color' ? (
              renderShapeSvg('circle', currentRound.colorHex, 34)
            ) : currentRound.attr === 'shape' ? (
              renderShapeSvg(currentRound.shapeName, '#9b9584', 34)
            ) : (
              renderShapeSvg(currentRound.shapeName, currentRound.colorHex, 34)
            )
          ) : (
            <div className="w-6 h-6 rounded-full border-2 border-dashed border-[#8B8677]" />
          )}
        </div>
        <div>
          <p className="font-serif font-bold text-[#1A3C34] text-sm leading-snug">
            {phase === 'complete'
              ? tGame.gameOver
              : getInstructionText()}
          </p>
          {phase === 'playing' && currentRound && (
            <p className="text-[11px] text-[#8B8677] mt-0.5 font-semibold">
              {tGame.foundCount(foundNum, currentRound.targetCount)}
            </p>
          )}
        </div>
      </div>

      {/* Grid of Shapes */}
      {currentRound && (
        <div className="grid grid-cols-3 gap-2.5">
          {currentRound.items.map((item, idx) => {
            const isWrong = wrongIndices.includes(idx);
            return (
              <button
                key={idx}
                onClick={() => handleTileClick(idx)}
                disabled={item.found || phase !== 'playing'}
                className={`aspect-square rounded-2xl bg-[#FFFCF2] flex items-center justify-center relative shadow-xs transition-all duration-150 active:scale-95 ${
                  item.found
                    ? 'bg-[#bfe6cf] cursor-default'
                    : isWrong
                    ? 'bg-[#f6cdae] scale-95 ring-2 ring-[#d9614c]'
                    : 'hover:shadow-md cursor-pointer'
                }`}
                aria-label={`Shape ${item.shape} ${item.colorName}`}
              >
                <div className={item.found ? 'opacity-55' : ''}>
                  {renderShapeSvg(item.shape, getColorHex(item.colorName), 44)}
                </div>

                {item.found && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#1F8A5F] flex items-center justify-center text-white shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Primary Action Button */}
      {phase === 'idle' && (
        <button
          onClick={handleStart}
          className="w-full py-3.5 rounded-full bg-[#1A3C34] hover:bg-[#15322b] text-white font-bold text-sm shadow-md transition-all active:scale-98"
        >
          {tGame.playAgain === 'Play Again' ? 'Start' : tGame.playAgain}
        </button>
      )}

      {phase === 'success' && (
        <button
          onClick={handleContinue}
          className="w-full py-3.5 rounded-full bg-[#1A3C34] hover:bg-[#15322b] text-white font-bold text-sm shadow-md transition-all active:scale-98 animate-in fade-in"
        >
          {tGame.roundSuccess}
        </button>
      )}

      {phase === 'complete' && (
        <button
          onClick={handleStart}
          className="w-full py-3.5 rounded-full bg-[#1A3C34] hover:bg-[#15322b] text-white font-bold text-sm shadow-md transition-all active:scale-98"
        >
          {tGame.playAgain}
        </button>
      )}
    </div>
  );
};
