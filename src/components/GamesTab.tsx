import React, { useState, useEffect } from 'react';
import { FamilyMember, GameSession, LanguageCode } from '../types';
import { bhashiniVoice } from '../utils/bhashiniVoice';
import { getTranslation } from '../utils/translations';
import { getGamesMenuStrings } from '../utils/gameLocalization';
import confetti from 'canvas-confetti';
import {
  Gamepad2,
  Sparkles,
  ChevronLeft,
  RotateCcw,
  CheckCircle2,
  Clock,
  ArrowRight,
  FolderCode,
  Palette,
  Boxes,
  Layers,
} from 'lucide-react';
import { TargetSpottingGame } from './games/TargetSpottingGame';
import { PatternRecallGame } from './games/PatternRecallGame';
import { UnoGame } from './games/UnoGame';

export interface GamesTabProps {
  familyMembers: FamilyMember[];
  currentLanguage: LanguageCode;
  onGameCompleted: (session: GameSession) => void;
  activeGameId?: string | null;
  onCloseGame?: () => void;
}

export interface GameDefinition {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  category: 'memory' | 'attention' | 'routine' | 'language' | 'custom';
  badgeColor: string;
  badgeTextColor: string;
  icon: React.ElementType;
  component?: React.ComponentType<{
    currentLanguage: LanguageCode;
    familyMembers: FamilyMember[];
    onFinish: (score: number, message: string) => void;
  }>;
}

// User-provided game files registered
export const GAMES_LIST: GameDefinition[] = [
  {
    id: 'uno_game',
    title: 'UNO Game Night',
    subtitle: 'Match colors & numbers vs bots with card animations and sound effects',
    duration: '5 min',
    category: 'routine',
    badgeColor: 'bg-[#FFEBEB]',
    badgeTextColor: 'text-[#D64545]',
    icon: Layers,
    component: UnoGame,
  },
  {
    id: 'target_spotting',
    title: 'Target & Color Spotting',
    subtitle: 'Tap only the shapes that match the target',
    duration: '3 min',
    category: 'attention',
    badgeColor: 'bg-[#FDECDA]',
    badgeTextColor: 'text-[#E07936]',
    icon: Palette,
    component: TargetSpottingGame,
  },
  {
    id: 'pattern_recall',
    title: 'Pattern Recall',
    subtitle: 'Watch the boxes light up, then tap in order',
    duration: '3 min',
    category: 'memory',
    badgeColor: 'bg-[#FFF3D2]',
    badgeTextColor: 'text-[#C48800]',
    icon: Boxes,
    component: PatternRecallGame,
  },
];

export const GamesTab: React.FC<GamesTabProps> = ({
  familyMembers,
  currentLanguage,
  onGameCompleted,
  activeGameId: externalActiveGameId,
  onCloseGame,
}) => {
  const [selectedGameId, setSelectedGameId] = useState<string | null>(externalActiveGameId || null);
  const [gameStartTime, setGameStartTime] = useState<number>(Date.now());
  const [completedResult, setCompletedResult] = useState<{ score: number; message: string } | null>(null);

  const t = getTranslation(currentLanguage);
  const localizedGames = getGamesMenuStrings(currentLanguage);

  useEffect(() => {
    if (externalActiveGameId) {
      setSelectedGameId(externalActiveGameId);
      setGameStartTime(Date.now());
      setCompletedResult(null);
    }
  }, [externalActiveGameId]);

  const handleStartGame = (id: string) => {
    bhashiniVoice.playGentleTone('chime');
    setSelectedGameId(id);
    setGameStartTime(Date.now());
    setCompletedResult(null);
  };

  const handleClose = () => {
    bhashiniVoice.stop();
    setSelectedGameId(null);
    setCompletedResult(null);
    if (onCloseGame) onCloseGame();
  };

  const finishGame = (score: number, message: string, gameTitle: string) => {
    bhashiniVoice.playGentleTone('success');
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#F5C244', '#2F9E76', '#173C36'],
      });
    } catch {
      // Confetti fallback
    }

    const duration = Math.max(25, Math.round((Date.now() - gameStartTime) / 1000));
    const session: GameSession = {
      id: 'sess-' + Date.now(),
      gameId: selectedGameId || 'custom_game',
      gameTitle,
      level: 1,
      score: Math.min(100, Math.max(50, score)),
      durationSeconds: duration,
      hintsUsed: 0,
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
    };

    onGameCompleted(session);
    setCompletedResult({ score: session.score, message });
  };

  const activeGame = GAMES_LIST.find(g => g.id === selectedGameId);
  const activeMeta = selectedGameId && (selectedGameId in localizedGames)
    ? localizedGames[selectedGameId as keyof typeof localizedGames]
    : null;
  const activeTitle = activeMeta?.title || activeGame?.title || 'Game';

  return (
    <div className="w-full max-w-lg mx-auto px-4 pb-28 pt-2 space-y-6 animate-in fade-in duration-300">
      {/* If an active game is selected and exists in GAMES_LIST */}
      {selectedGameId && activeGame ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFDF6] border border-[#173C36]/10 text-xs font-bold text-[#173C36] hover:bg-white shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t.games.backToGames}</span>
            </button>
            <span className="text-xs font-bold text-[#173C36]/70">
              {activeTitle}
            </span>
          </div>

          {completedResult ? (
            <div className="rounded-[32px] bg-[#FFFDF6] border border-[#173C36]/10 p-7 text-center space-y-5 shadow-xs animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-[#E1F5EE] text-[#2F9E76] flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-[#173C36]">
                  {t.games.wellDone}
                </h3>
                <p className="text-xs text-[#173C36]/70 mt-1">
                  {completedResult.message}
                </p>
                <div className="mt-3 inline-block px-4 py-1.5 rounded-full bg-[#F5C244] text-[#173C36] font-bold text-sm">
                  {completedResult.score} {t.games.scoreLabel}
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setCompletedResult(null);
                    setGameStartTime(Date.now());
                  }}
                  className="px-5 py-2.5 rounded-full bg-[#FFFBEF] border border-[#173C36]/10 text-xs font-bold text-[#173C36] hover:bg-white flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t.games.playAgain}</span>
                </button>
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-full bg-[#173C36] text-white text-xs font-bold shadow-xs hover:bg-[#1f4e46]"
                >
                  {t.games.finishSession}
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-[32px] bg-[#FFFDF6] border border-[#173C36]/10 p-5 sm:p-6 shadow-sm">
              {activeGame.component ? (
                <activeGame.component
                  currentLanguage={currentLanguage}
                  familyMembers={familyMembers}
                  onFinish={(score, msg) => finishGame(score, msg, activeTitle)}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm font-semibold text-[#173C36]">Game content loading...</p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Eyebrow label */}
          <div className="tracking-[0.18em] uppercase text-[11px] font-bold text-[#173C36]/60">
            {t.games.eyebrow}
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#173C36] leading-tight">
              {t.games.headline}
            </h1>
            <p className="text-xs text-[#173C36]/75 mt-1 font-medium">
              {t.games.subtitle}
            </p>
          </div>

          {/* If games list is empty (All previous games removed) */}
          {GAMES_LIST.length === 0 ? (
            <div className="rounded-[32px] bg-[#FFFDF6] border-2 border-dashed border-[#173C36]/15 p-8 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-[#FFFBEF] border border-[#173C36]/10 text-[#E07936] flex items-center justify-center mx-auto shadow-xs">
                <Gamepad2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-display font-bold text-[#173C36]">
                  Ready for Your Games
                </h3>
                <p className="text-xs text-[#173C36]/70 mt-1 max-w-sm mx-auto leading-relaxed">
                  All previous games have been removed as requested. Please provide your game files or code, and they will be added right here!
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDECDA] text-[#C4641B] text-xs font-bold">
                <FolderCode className="w-4 h-4" />
                <span>Waiting for game files</span>
              </div>
            </div>
          ) : (
            /* Render game cards when user provides games */
            <div className="space-y-3.5">
              {GAMES_LIST.map(game => {
                const Icon = game.icon;
                const meta = game.id in localizedGames
                  ? localizedGames[game.id as keyof typeof localizedGames]
                  : null;
                const title = meta?.title || game.title;
                const subtitle = meta?.subtitle || game.subtitle;
                const duration = meta?.duration || game.duration;

                return (
                  <div
                    key={game.id}
                    id={`game-card-${game.id}`}
                    onClick={() => handleStartGame(game.id)}
                    className="rounded-[28px] bg-[#FFFDF6] border border-[#173C36]/5 p-5 flex items-center justify-between gap-3 shadow-xs hover:bg-white active:scale-[0.99] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-13 h-13 rounded-2xl ${game.badgeColor} ${game.badgeTextColor} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}
                      >
                        <Icon className="w-6 h-6 stroke-[2]" />
                      </div>

                      <div>
                        <h3 className="text-base font-display font-bold text-[#173C36] group-hover:text-[#2F9E76] transition-colors">
                          {title}
                        </h3>
                        <p className="text-xs text-[#173C36]/70 mb-2">
                          {subtitle}
                        </p>
                        <span className="inline-block px-3 py-0.5 rounded-full bg-[#FDF0BE] text-[#173C36] text-[11px] font-bold">
                          {duration}
                        </span>
                      </div>
                    </div>

                    <div className="w-9 h-9 rounded-full bg-[#FFFBEF] border border-[#173C36]/10 flex items-center justify-center text-[#173C36]/60 group-hover:text-[#173C36] group-hover:bg-[#F5C244] transition-all shrink-0">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};
