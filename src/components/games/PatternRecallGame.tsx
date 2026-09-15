import React, { useState, useEffect, useRef } from 'react';
import { LanguageCode } from '../../types';
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { getPatternRecallStrings } from '../../utils/gameLocalization';
import { bhashiniVoice } from '../../utils/bhashiniVoice';

interface PatternRecallGameProps {
  currentLanguage: LanguageCode;
  onFinish: (score: number, message: string) => void;
}

const levels = {
  easy: { length: 3, showMs: 900, gapMs: 400, desc: 'Watch the pattern, then tap the same boxes back in order.', label: 'Easy', sub: '3 to remember' },
  medium: { length: 4, showMs: 800, gapMs: 350, desc: 'A little longer this time — take all the time you need.', label: 'Medium', sub: '4 to remember' },
  hard: { length: 5, showMs: 700, gapMs: 300, desc: 'The longest pattern yet. Play it again as many times as you like.', label: 'Hard', sub: '5 to remember' },
};

const totalRounds = 5;

const explainerScript =
  "This game is called Pattern Recall. Watch the boxes light up. Remember the order. Now tap them, the same way. Take your time. You can watch it again, any time you like. Let's begin.";

export const PatternRecallGame: React.FC<PatternRecallGameProps> = ({
  currentLanguage,
  onFinish,
}) => {
  const tPattern = getPatternRecallStrings(currentLanguage);
  const [levelKey, setLevelKey] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [round, setRound] = useState(1);
  const [pattern, setPattern] = useState<number[]>([]);
  const [userIdx, setUserIdx] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'showing' | 'input' | 'retry' | 'success' | 'complete'>('idle');
  const [litTile, setLitTile] = useState<number | null>(null);
  const [correctTile, setCorrectTile] = useState<number | null>(null);
  const [wrongTile, setWrongTile] = useState<number | null>(null);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);

  const timeoutHandles = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimeouts = () => {
    timeoutHandles.current.forEach(clearTimeout);
    timeoutHandles.current = [];
  };

  // TTS Explainer
  const setVoiceState = (playing: boolean) => {
    setIsVoicePlaying(playing);
  };

  const speakScript = () => {
    bhashiniVoice.speak(tPattern.explainer, currentLanguage);
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
      clearAllTimeouts();
    };
  }, []);

  const shuffledIndices = () => {
    const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const generatePattern = (lvl: 'easy' | 'medium' | 'hard') => {
    return shuffledIndices().slice(0, levels[lvl].length);
  };

  const playPatternSequence = (pat: number[], lvl: 'easy' | 'medium' | 'hard') => {
    clearAllTimeouts();
    setPhase('showing');
    setLitTile(null);
    setCorrectTile(null);
    setWrongTile(null);

    const cfg = levels[lvl];
    let t = 200;

    pat.forEach((tileIdx) => {
      const h1 = setTimeout(() => {
        setLitTile(tileIdx);
      }, t);
      const h2 = setTimeout(() => {
        setLitTile(null);
      }, t + cfg.showMs);
      timeoutHandles.current.push(h1, h2);
      t += cfg.showMs + cfg.gapMs;
    });

    const hFinal = setTimeout(() => {
      setPhase('input');
      setUserIdx(0);
    }, t);
    timeoutHandles.current.push(hFinal);
  };

  const startRound = (lvl: 'easy' | 'medium' | 'hard', rNum: number) => {
    const newPat = generatePattern(lvl);
    setPattern(newPat);
    playPatternSequence(newPat, lvl);
  };

  const handleStart = () => {
    stopScript();
    setRound(1);
    startRound(levelKey, 1);
  };

  const handleContinue = () => {
    if (round >= totalRounds) {
      setPhase('complete');
      onFinish(95, "Wonderful! You've completed today's pattern game.");
    } else {
      const nextR = round + 1;
      setRound(nextR);
      startRound(levelKey, nextR);
    }
  };

  const handleLevelChange = (lvl: 'easy' | 'medium' | 'hard') => {
    clearAllTimeouts();
    setLevelKey(lvl);
    setRound(1);
    setPhase('idle');
    setPattern([]);
    setLitTile(null);
    setCorrectTile(null);
    setWrongTile(null);
  };

  const handleReplayPattern = () => {
    if (phase !== 'input') return;
    setUserIdx(0);
    playPatternSequence(pattern, levelKey);
  };

  const handleTileClick = (idx: number) => {
    if (phase !== 'input') return;

    if (pattern[userIdx] === idx) {
      // Correct tile tapped
      setCorrectTile(idx);
      const h = setTimeout(() => {
        setCorrectTile(null);
      }, 250);
      timeoutHandles.current.push(h);

      const nextUserIdx = userIdx + 1;
      setUserIdx(nextUserIdx);

      if (nextUserIdx === pattern.length) {
        setPhase('success');
      }
    } else {
      // Wrong tile tapped
      setWrongTile(idx);
      setPhase('retry');
      const h1 = setTimeout(() => {
        setWrongTile(null);
      }, 350);
      const h2 = setTimeout(() => {
        playPatternSequence(pattern, levelKey);
      }, 900);
      timeoutHandles.current.push(h1, h2);
    }
  };

  return (
    <div className="space-y-4">
      {/* Eyebrow & Heading */}
      <div>
        <div className="text-[10px] font-bold tracking-widest uppercase text-[#8B8677]">
          Smriti
        </div>
        <h2 className="text-xl font-display font-bold text-[#1A3C34] mt-0.5">
          {tPattern.yourTurn}
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
            <div className="text-xs font-bold">{tPattern.levels[lvl]}</div>
            <div className={`text-[9.5px] mt-0.5 font-medium ${levelKey === lvl ? 'text-[#5c4413]' : 'text-[#8B8677]'}`}>
              {lvl === 'easy' ? 'Level 1' : lvl === 'medium' ? 'Level 2' : 'Level 3'}
            </div>
          </button>
        ))}
      </div>

      {/* Status Row & Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-bold text-[#8B8677]">
          <span>{tPattern.roundCount(Math.min(round, totalRounds), totalRounds)}</span>
          <span className="text-[#1A3C34]">
            {phase === 'idle'
              ? '...'
              : phase === 'showing'
              ? tPattern.watchPattern
              : phase === 'input'
              ? tPattern.yourTurn
              : phase === 'retry'
              ? tPattern.tryAgain
              : phase === 'success'
              ? tPattern.success
              : tPattern.complete}
          </span>
        </div>
        <div className="h-2 bg-[#f3e6bd] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#F5C242] rounded-full transition-all duration-300"
            style={{ width: `${((Math.min(round, totalRounds) - (phase === 'complete' ? 0 : 1)) / totalRounds) * 100}%` }}
          />
        </div>
      </div>

      {/* 3x3 Grid of Tiles */}
      <div className="grid grid-cols-3 gap-3 py-1">
        {Array.from({ length: 9 }).map((_, idx) => {
          const isLit = litTile === idx;
          const isCorrect = correctTile === idx;
          const isWrong = wrongTile === idx;
          const isClickable = phase === 'input';

          return (
            <button
              key={idx}
              onClick={() => handleTileClick(idx)}
              disabled={!isClickable}
              className={`aspect-square rounded-2xl border border-[#eadfb8]/80 shadow-xs transition-all duration-150 active:scale-95 flex items-center justify-center ${
                isLit
                  ? 'bg-[#F5C242] scale-95 shadow-md border-[#F5C242]'
                  : isCorrect
                  ? 'bg-[#bfe6cf] border-[#1F8A5F]'
                  : isWrong
                  ? 'bg-[#f6cdae] border-[#d9614c] scale-95'
                  : 'bg-[#FFFCF2] hover:bg-white'
              } ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
              aria-label={`Tile ${idx + 1}`}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full transition-opacity ${
                  isLit ? 'bg-[#16332C] opacity-70' : 'bg-[#16332C]/10 opacity-30'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Action Controls */}
      {phase === 'idle' && (
        <button
          onClick={handleStart}
          className="w-full py-3.5 rounded-full bg-[#1A3C34] hover:bg-[#15322b] text-white font-bold text-sm shadow-md transition-all active:scale-98"
        >
          {tPattern.playAgain === 'Play Again' ? 'Start' : tPattern.playAgain}
        </button>
      )}

      {phase === 'input' && (
        <button
          onClick={handleReplayPattern}
          className="w-full py-2.5 text-center text-xs font-bold text-[#1A3C34] hover:text-[#16332C] flex items-center justify-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{tPattern.tryAgain}</span>
        </button>
      )}

      {phase === 'success' && (
        <button
          onClick={handleContinue}
          className="w-full py-3.5 rounded-full bg-[#1A3C34] hover:bg-[#15322b] text-white font-bold text-sm shadow-md transition-all active:scale-98 animate-in fade-in"
        >
          {tPattern.success}
        </button>
      )}

      {phase === 'complete' && (
        <button
          onClick={handleStart}
          className="w-full py-3.5 rounded-full bg-[#1A3C34] hover:bg-[#15322b] text-white font-bold text-sm shadow-md transition-all active:scale-98"
        >
          {tPattern.playAgain}
        </button>
      )}

      {/* Helper text */}
      <p className="text-xs text-[#8B8677] text-center font-medium leading-relaxed px-2">
        {phase === 'complete'
          ? tPattern.complete
          : levels[levelKey].desc}
      </p>
    </div>
  );
};
