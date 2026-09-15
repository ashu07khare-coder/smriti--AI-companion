import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LanguageCode, FamilyMember } from '../../types';
import {
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Trophy,
  ArrowRight,
  User,
  Bot as BotIcon,
  Play,
} from 'lucide-react';

interface UnoGameProps {
  currentLanguage: LanguageCode;
  familyMembers?: FamilyMember[];
  onFinish: (score: number, message: string) => void;
}

// ---------------------------------------------------------------------------
// Card Sound Synthesizer via Web Audio API (Realistic card friction & snaps)
// ---------------------------------------------------------------------------
class CardAudioSynthesizer {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Quick card shuffle / friction sound
  playDrawSound() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // White noise buffer for paper friction slide
      const bufferSize = ctx.sampleRate * 0.12;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(700, now + 0.12);
      filter.Q.setValueAtTime(2.5, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.13);
    } catch {
      // Audio fallback
    }
  }

  // Crisp table snap when placing a card on the discard pile
  playSnapSound() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // High snap burst
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);

      // Add a quick paper slap noise overlay
      const bufferSize = ctx.sampleRate * 0.05;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.setValueAtTime(1800, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.3, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.06);
    } catch {
      // Audio fallback
    }
  }

  // Cheerful chime on calling UNO
  playUnoChime() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.25, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.36);
      });
    } catch {
      // Audio fallback
    }
  }
}

const cardAudio = new CardAudioSynthesizer();

// ---------------------------------------------------------------------------
// Card Data Structures & Color Schemes
// ---------------------------------------------------------------------------
export type UnoColor = 'red' | 'yellow' | 'green' | 'blue' | 'wild';
export type UnoCardType = 'number' | 'skip' | 'reverse' | 'draw2' | 'wild' | 'wild4';

export interface UnoCard {
  id: string;
  color: UnoColor;
  type: UnoCardType;
  value: number | null;
}

export interface UnoPlayer {
  id: number;
  name: string;
  isBot: boolean;
  hand: UnoCard[];
  calledUno: boolean;
}

const COLOR_HEX: Record<UnoColor, string> = {
  red: '#D64545',
  yellow: '#E8B93F',
  green: '#3F9142',
  blue: '#2E6FB0',
  wild: '#2b2b2b',
};

let cardGlobalUid = 0;

function createDeck(): UnoCard[] {
  const colors: ('red' | 'yellow' | 'green' | 'blue')[] = ['red', 'yellow', 'green', 'blue'];
  const deck: UnoCard[] = [];

  const genId = (prefix: string) => `${prefix}_${Date.now()}_${++cardGlobalUid}`;

  colors.forEach(color => {
    deck.push({ id: genId(`c_${color}_0`), color, type: 'number', value: 0 });
    for (let v = 1; v <= 9; v++) {
      deck.push({ id: genId(`c_${color}_${v}_a`), color, type: 'number', value: v });
      deck.push({ id: genId(`c_${color}_${v}_b`), color, type: 'number', value: v });
    }
    (['skip', 'reverse', 'draw2'] as const).forEach(type => {
      deck.push({ id: genId(`c_${color}_${type}_a`), color, type, value: null });
      deck.push({ id: genId(`c_${color}_${type}_b`), color, type, value: null });
    });
  });

  for (let i = 0; i < 4; i++) deck.push({ id: genId(`c_wild_${i}`), color: 'wild', type: 'wild', value: null });
  for (let i = 0; i < 4; i++) deck.push({ id: genId(`c_wild4_${i}`), color: 'wild', type: 'wild4', value: null });

  return deck;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function isValidPlay(card: UnoCard, topCard: UnoCard | null, activeColor: UnoColor | null): boolean {
  if (!topCard) return true;
  if (card.color === 'wild') return true;
  if (card.color === activeColor) return true;
  if (card.type !== 'number' && card.type === topCard.type) return true;
  if (card.type === 'number' && topCard.type === 'number' && card.value === topCard.value) return true;
  return false;
}

function describeCard(card: UnoCard): string {
  const colorLabel = card.color === 'wild' ? 'Wild' : card.color.charAt(0).toUpperCase() + card.color.slice(1);
  if (card.type === 'number') return `${colorLabel} ${card.value}`;
  if (card.type === 'skip') return `${colorLabel} Skip`;
  if (card.type === 'reverse') return `${colorLabel} Reverse`;
  if (card.type === 'draw2') return `${colorLabel} Draw Two`;
  if (card.type === 'wild') return 'Wild';
  if (card.type === 'wild4') return 'Wild Draw Four';
  return colorLabel;
}

// ---------------------------------------------------------------------------
// Animated Card Component with SVGs and Patterns
// ---------------------------------------------------------------------------
interface CardViewProps {
  card: UnoCard;
  isPlayable?: boolean;
  isDimmed?: boolean;
  onClick?: () => void;
  isDealing?: boolean;
  dealDelayMs?: number;
  className?: string;
  isFlying?: boolean;
}

const CardView: React.FC<CardViewProps> = ({
  card,
  isPlayable = false,
  isDimmed = false,
  onClick,
  isDealing = false,
  dealDelayMs = 0,
  className = '',
}) => {
  const bg = COLOR_HEX[card.color] || COLOR_HEX.wild;

  return (
    <div
      onClick={isPlayable ? onClick : undefined}
      style={{
        backgroundColor: bg,
        animationDelay: isDealing ? `${dealDelayMs}ms` : undefined,
      }}
      className={`w-[66px] h-[96px] sm:w-[78px] sm:h-[114px] rounded-2xl relative border-2 border-white/95 flex items-center justify-center select-none transition-all duration-300 shrink-0 ${
        isPlayable
          ? 'cursor-pointer ring-4 sm:ring-[5px] ring-[#F5C242] shadow-[0_12px_28px_rgba(245,194,66,0.75)] -translate-y-5 sm:-translate-y-6 animate-playable-glow hover:-translate-y-7 hover:scale-105 active:scale-95'
          : isDimmed
          ? 'opacity-40 grayscale-[35%] brightness-90 shadow-xs'
          : 'opacity-95 shadow-md'
      } ${isDealing ? 'animate-deal-in' : ''} ${className}`}
    >
      {/* Floating Senior-Friendly "PLAY" Badge */}
      {isPlayable && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#173C36] text-[#F5C242] border-2 border-[#F5C242] font-black text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap flex items-center gap-1 z-30 pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3F9142] animate-ping" />
          <span>PLAY</span>
        </div>
      )}

      {/* Corner Labels with High-Contrast Dropshadows */}
      {card.type === 'number' && (
        <>
          <span className="absolute top-1 left-1.5 font-black text-xs sm:text-sm text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.85)]">
            {card.value}
          </span>
          <span className="absolute bottom-1 right-1.5 font-black text-xs sm:text-sm text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.85)] rotate-180">
            {card.value}
          </span>
        </>
      )}

      {card.type === 'draw2' && (
        <>
          <span className="absolute top-1 left-1 font-black text-[11px] sm:text-xs text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.85)]">+2</span>
          <span className="absolute bottom-1 right-1 font-black text-[11px] sm:text-xs text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.85)] rotate-180">+2</span>
        </>
      )}

      {card.type === 'wild4' && (
        <>
          <span className="absolute top-1 left-1 font-black text-[11px] sm:text-xs text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.85)]">+4</span>
          <span className="absolute bottom-1 right-1 font-black text-[11px] sm:text-xs text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.85)] rotate-180">+4</span>
        </>
      )}

      {/* Center Graphics - High Contrast & Large for Low-Vision */}
      {card.type === 'number' && (
        <span className="font-serif font-black text-3xl sm:text-4xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] tracking-tight">
          {card.value}
        </span>
      )}

      {card.type === 'draw2' && (
        <span className="font-serif font-black text-2xl sm:text-3xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
          +2
        </span>
      )}

      {card.type === 'skip' && (
        <svg viewBox="0 0 40 40" className="w-9 h-9 sm:w-11 sm:h-11 text-white drop-shadow-md" fill="none">
          <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="4" />
          <line x1="10" y1="30" x2="30" y2="10" stroke="currentColor" strokeWidth="4" />
        </svg>
      )}

      {card.type === 'reverse' && (
        <svg viewBox="0 0 40 40" className="w-9 h-9 sm:w-11 sm:h-11 text-white drop-shadow-md" fill="none">
          <path d="M12 10 A14 14 0 1 1 10 24" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <polygon points="6,8 16,10 10,18" fill="currentColor" />
          <path d="M28 30 A14 14 0 1 1 30 16" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <polygon points="34,32 24,30 30,22" fill="currentColor" />
        </svg>
      )}

      {(card.type === 'wild' || card.type === 'wild4') && (
        <div className="relative w-9 h-9 sm:w-11 sm:h-11">
          <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-md">
            <path d="M20 20 L20 3 A17 17 0 0 1 37 20 Z" fill="#D64545" />
            <path d="M20 20 L37 20 A17 17 0 0 1 20 37 Z" fill="#3F9142" />
            <path d="M20 20 L20 37 A17 17 0 0 1 3 20 Z" fill="#2E6FB0" />
            <path d="M20 20 L3 20 A17 17 0 0 1 20 3 Z" fill="#E8B93F" />
          </svg>
          {card.type === 'wild4' && (
            <span className="absolute -bottom-1 -right-1 text-xs font-black text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.9)]">
              +4
            </span>
          )}
        </div>
      )}
    </div>
  );
};

const CardBack: React.FC<{ count?: number; isDeck?: boolean; onClick?: () => void; isHint?: boolean }> = ({
  count,
  isDeck = false,
  onClick,
  isHint = false,
}) => (
  <div
    onClick={onClick}
    className={`w-[66px] h-[96px] sm:w-[78px] sm:h-[114px] rounded-2xl bg-gradient-to-br from-[#233742] to-[#0d161b] border-2 border-white/90 shadow-md flex flex-col items-center justify-center select-none relative transition-transform ${
      isDeck && isHint ? 'ring-4 ring-[#F5C242] animate-bounce cursor-pointer' : ''
    } ${isDeck ? 'cursor-pointer hover:scale-105 active:scale-95' : ''}`}
  >
    <div className="px-2 py-0.5 rounded-full bg-white text-[#D64545] font-serif font-black text-xs sm:text-sm -rotate-12 shadow-xs">
      UNO
    </div>
    {count !== undefined && (
      <span className="absolute -bottom-5 text-[10px] sm:text-xs font-bold text-[#173C36] whitespace-nowrap">
        {count} cards
      </span>
    )}
  </div>
);

// ---------------------------------------------------------------------------
// Main UNO Component
// ---------------------------------------------------------------------------
export const UnoGame: React.FC<UnoGameProps> = ({ currentLanguage, familyMembers, onFinish }) => {
  const [deck, setDeck] = useState<UnoCard[]>([]);
  const [discard, setDiscard] = useState<UnoCard[]>([]);
  const [players, setPlayers] = useState<UnoPlayer[]>([]);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState<number>(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [activeColor, setActiveColor] = useState<UnoColor>('red');
  const [statusText, setStatusText] = useState<string>('Welcome to UNO Game Night!');
  const [logs, setLogs] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winnerIdx, setWinnerIdx] = useState<number | null>(null);

  // Interaction & Animated Flow States
  const [pendingWildCard, setPendingWildCard] = useState<UnoCard | null>(null);
  const [pendingDrawnCard, setPendingDrawnCard] = useState<UnoCard | null>(null);
  const [isTurnLocked, setIsTurnLocked] = useState<boolean>(false);
  const [isDealingPhase, setIsDealingPhase] = useState<boolean>(true);
  const [soundMuted, setSoundMuted] = useState<boolean>(false);

  // Flying Card Animation State
  const [flyingCard, setFlyingCard] = useState<{
    card: UnoCard;
    from: 'deck' | 'human' | 'bot1' | 'bot2' | 'bot3';
    to: 'discard' | 'human';
  } | null>(null);

  // Synchronized refs to avoid stale closure state in async timeouts
  const deckRef = useRef<UnoCard[]>([]);
  const discardRef = useRef<UnoCard[]>([]);
  const playersRef = useRef<UnoPlayer[]>([]);
  const activeColorRef = useRef<UnoColor>('red');
  const directionRef = useRef<1 | -1>(1);

  const syncDeck = (d: UnoCard[]) => {
    deckRef.current = d;
    setDeck(d);
  };
  const syncDiscard = (d: UnoCard[]) => {
    discardRef.current = d;
    setDiscard(d);
  };
  const syncPlayers = (p: UnoPlayer[]) => {
    playersRef.current = p;
    setPlayers(p);
  };
  const syncActiveColor = (c: UnoColor) => {
    activeColorRef.current = c;
    setActiveColor(c);
  };
  const syncDirection = (dir: 1 | -1) => {
    directionRef.current = dir;
    setDirection(dir);
  };

  const botTimerRef = useRef<NodeJS.Timeout | null>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev.slice(0, 15)]);
  };

  const toggleSound = () => {
    cardAudio.enabled = soundMuted;
    setSoundMuted(!soundMuted);
  };

  // -------------------------------------------------------------------------
  // Start New Game & Deal
  // -------------------------------------------------------------------------
  const startNewGame = useCallback(() => {
    if (botTimerRef.current) clearTimeout(botTimerRef.current);

    const fullDeck = shuffle(createDeck());
    const bot1Name = familyMembers?.[0]?.name ? `${familyMembers[0].name}` : 'Aarav (Bot 1)';
    const bot2Name = familyMembers?.[1]?.name ? `${familyMembers[1].name}` : 'Priya (Bot 2)';
    const bot3Name = familyMembers?.[2]?.name ? `${familyMembers[2].name}` : 'Dev (Bot 3)';

    const newPlayers: UnoPlayer[] = [
      { id: 0, name: 'You', isBot: false, hand: [], calledUno: false },
      { id: 1, name: bot1Name, isBot: true, hand: [], calledUno: false },
      { id: 2, name: bot2Name, isBot: true, hand: [], calledUno: false },
      { id: 3, name: bot3Name, isBot: true, hand: [], calledUno: false },
    ];

    // Deal 7 cards each
    newPlayers.forEach(p => {
      p.hand = fullDeck.splice(0, 7);
    });

    // Pick top card that isn't Wild+4
    let first = fullDeck.pop()!;
    while (first.type === 'wild4') {
      fullDeck.unshift(first);
      first = fullDeck.pop()!;
    }

    const firstColor = first.color === 'wild' ? 'red' : first.color;

    syncDeck(fullDeck);
    syncDiscard([first]);
    syncPlayers(newPlayers);
    syncDirection(1);
    syncActiveColor(firstColor);

    setCurrentPlayerIdx(0);
    setGameOver(false);
    setWinnerIdx(null);
    setPendingWildCard(null);
    setPendingDrawnCard(null);
    setIsDealingPhase(true);
    setIsTurnLocked(false);
    setStatusText('Dealing cards to all players…');
    setLogs(['New game started. Good luck!']);

    // Play initial deal sound sequence
    cardAudio.playDrawSound();
    setTimeout(() => cardAudio.playDrawSound(), 180);
    setTimeout(() => cardAudio.playDrawSound(), 350);

    setTimeout(() => {
      setIsDealingPhase(false);
      setStatusText('Your turn — tap a highlighted card to play.');
    }, 900);
  }, [familyMembers]);

  useEffect(() => {
    startNewGame();
    return () => {
      if (botTimerRef.current) clearTimeout(botTimerRef.current);
    };
  }, [startNewGame]);

  // -------------------------------------------------------------------------
  // Drawing & Reshuffling Logic (Ref-backed for zero race conditions)
  // -------------------------------------------------------------------------
  const drawCardsForPlayer = (playerIdx: number, count: number): UnoCard[] => {
    const currentDeck = [...deckRef.current];
    let currentDiscard = [...discardRef.current];

    const drawn: UnoCard[] = [];
    for (let i = 0; i < count; i++) {
      if (currentDeck.length === 0 && currentDiscard.length > 1) {
        const top = currentDiscard.pop()!;
        currentDeck.push(...shuffle(currentDiscard));
        currentDiscard = [top];
        addLog('Deck reshuffled from discard pile.');
      }
      if (currentDeck.length === 0) break;
      drawn.push(currentDeck.pop()!);
    }

    syncDeck(currentDeck);
    syncDiscard(currentDiscard);

    const updatedPlayers = playersRef.current.map((p, idx) => {
      if (idx === playerIdx) {
        const newHand = [...p.hand, ...drawn];
        return {
          ...p,
          hand: newHand,
          calledUno: newHand.length === 1 ? p.calledUno : false,
        };
      }
      return p;
    });

    syncPlayers(updatedPlayers);
    cardAudio.playDrawSound();
    return drawn;
  };

  // -------------------------------------------------------------------------
  // Turn Progression
  // -------------------------------------------------------------------------
  const finishTurn = (playerIdx: number, effect: string | null) => {
    const currentPlayers = [...playersRef.current];
    const p = currentPlayers[playerIdx];

    if (p && p.hand.length === 1 && !p.calledUno) {
      drawCardsForPlayer(playerIdx, 2);
      addLog(`${p.name} forgot to call UNO and drew 2 penalty cards!`);
    } else if (p) {
      p.calledUno = false;
      syncPlayers(currentPlayers);
    }

    let newDir = directionRef.current;
    if (effect === 'reverse') {
      newDir = (newDir * -1) as 1 | -1;
      syncDirection(newDir);
      addLog('Direction reversed!');
    }

    const n = 4;
    let nextIdx = (playerIdx + newDir + n) % n;

    if (effect === 'skip' || effect === 'draw2' || effect === 'wild4') {
      const skippedPlayer = playersRef.current[nextIdx];
      if (effect === 'draw2') {
        drawCardsForPlayer(nextIdx, 2);
        addLog(`${skippedPlayer?.name || 'Player'} drew 2 cards and was skipped.`);
      } else if (effect === 'wild4') {
        drawCardsForPlayer(nextIdx, 4);
        addLog(`${skippedPlayer?.name || 'Player'} drew 4 cards and was skipped.`);
      } else {
        addLog(`${skippedPlayer?.name || 'Player'} was skipped.`);
      }
      nextIdx = (nextIdx + newDir + n) % n;
    }

    setCurrentPlayerIdx(nextIdx);
    setIsTurnLocked(false);
  };

  // -------------------------------------------------------------------------
  // Execute Card Play
  // -------------------------------------------------------------------------
  const executePlayCard = (playerIdx: number, card: UnoCard, chosenColor: UnoColor | null) => {
    const p = playersRef.current[playerIdx];
    if (!p) return;
    const newColor = card.color === 'wild' ? chosenColor || 'red' : card.color;

    // Trigger visual flying card animation
    const fromLocation: 'human' | 'bot1' | 'bot2' | 'bot3' =
      playerIdx === 0 ? 'human' : (`bot${playerIdx}` as 'bot1' | 'bot2' | 'bot3');

    setFlyingCard({
      card,
      from: fromLocation,
      to: 'discard',
    });

    // Sound effect: crisp card snap
    cardAudio.playSnapSound();

    setTimeout(() => {
      setFlyingCard(null);

      // Remove card from player's hand and push to discard
      const updatedPlayers = playersRef.current.map((pl, idx) => {
        if (idx === playerIdx) {
          return {
            ...pl,
            hand: pl.hand.filter(c => c.id !== card.id),
          };
        }
        return pl;
      });
      syncPlayers(updatedPlayers);

      syncDiscard([...discardRef.current, card]);
      syncActiveColor(newColor);
      addLog(`${p.name} played ${describeCard(card)}.`);

      const remainingHandCount = updatedPlayers[playerIdx].hand.length;

      // Check win condition
      if (remainingHandCount === 0) {
        setGameOver(true);
        setWinnerIdx(playerIdx);
        addLog(`${p.name} wins the match!`);
        if (playerIdx === 0) {
          cardAudio.playUnoChime();
          onFinish(100, 'Congratulations! You won the UNO game night!');
        } else {
          onFinish(70, `${p.name} won this round. Great effort!`);
        }
        return;
      }

      // Check bot UNO call
      if (remainingHandCount === 1 && p.isBot) {
        if (Math.random() < 0.8) {
          const copy = [...playersRef.current];
          copy[playerIdx].calledUno = true;
          syncPlayers(copy);
          cardAudio.playUnoChime();
          addLog(`${p.name} called UNO!`);
        }
      }

      let effect: string | null = null;
      if (card.type === 'skip') effect = 'skip';
      else if (card.type === 'reverse') effect = 'reverse';
      else if (card.type === 'draw2') effect = 'draw2';
      else if (card.type === 'wild4') effect = 'wild4';

      finishTurn(playerIdx, effect);
    }, 280);
  };

  // -------------------------------------------------------------------------
  // Bot Turn Automation
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (gameOver || isDealingPhase || currentPlayerIdx === 0) return;

    const bot = playersRef.current[currentPlayerIdx];
    if (!bot || !bot.isBot) return;

    setIsTurnLocked(true);
    setStatusText(`${bot.name} is thinking…`);

    botTimerRef.current = setTimeout(() => {
      const currentDiscard = discardRef.current;
      const topCard = currentDiscard[currentDiscard.length - 1];
      const currentColor = activeColorRef.current;
      const currentBot = playersRef.current[currentPlayerIdx];
      if (!currentBot) return;

      const validCards = currentBot.hand.filter(c => isValidPlay(c, topCard, currentColor));

      if (validCards.length > 0) {
        // Pick best card
        const nonWild = validCards.filter(c => c.color !== 'wild');
        const chosen = nonWild.length > 0 ? nonWild[0] : validCards[0];

        // Best bot color
        const colorCounts: Record<string, number> = { red: 0, yellow: 0, green: 0, blue: 0 };
        currentBot.hand.forEach(c => {
          if (c.color in colorCounts) colorCounts[c.color]++;
        });
        const bestColor = (Object.keys(colorCounts).reduce((a, b) =>
          colorCounts[a] > colorCounts[b] ? a : b
        ) as UnoColor) || 'red';

        executePlayCard(currentPlayerIdx, chosen, chosen.color === 'wild' ? bestColor : null);
      } else {
        // Draw card
        setStatusText(`${currentBot.name} draws a card.`);
        const drawn = drawCardsForPlayer(currentPlayerIdx, 1);
        const latestTop = discardRef.current[discardRef.current.length - 1];
        const latestColor = activeColorRef.current;

        if (drawn.length > 0 && isValidPlay(drawn[0], latestTop, latestColor)) {
          setTimeout(() => {
            executePlayCard(currentPlayerIdx, drawn[0], 'red');
          }, 500);
        } else {
          setTimeout(() => {
            finishTurn(currentPlayerIdx, null);
          }, 400);
        }
      }
    }, 1100 + Math.random() * 400);

    return () => {
      if (botTimerRef.current) clearTimeout(botTimerRef.current);
    };
  }, [currentPlayerIdx, gameOver, isDealingPhase]);

  // Update Status for Human Turn
  useEffect(() => {
    if (gameOver || isDealingPhase) return;
    if (currentPlayerIdx === 0) {
      const human = playersRef.current[0];
      const top = discardRef.current[discardRef.current.length - 1];
      const playable = human?.hand.filter(c => isValidPlay(c, top, activeColorRef.current)) || [];
      if (playable.length > 0) {
        setStatusText('Your turn — tap a highlighted card to play.');
      } else {
        setStatusText('No playable cards. Tap the deck to draw!');
      }
    }
  }, [currentPlayerIdx, activeColor, discard, players, gameOver, isDealingPhase]);

  // -------------------------------------------------------------------------
  // Human Player Actions
  // -------------------------------------------------------------------------
  const handleHumanCardClick = (card: UnoCard) => {
    if (currentPlayerIdx !== 0 || isTurnLocked || gameOver || isDealingPhase) return;

    if (card.color === 'wild') {
      setPendingWildCard(card);
    } else {
      setIsTurnLocked(true);
      executePlayCard(0, card, null);
    }
  };

  const handleWildColorSelect = (selectedColor: UnoColor) => {
    if (!pendingWildCard) return;
    const card = pendingWildCard;
    setPendingWildCard(null);
    setIsTurnLocked(true);
    executePlayCard(0, card, selectedColor);
  };

  const handleDrawPileClick = () => {
    if (currentPlayerIdx !== 0 || isTurnLocked || gameOver || isDealingPhase) return;

    const human = playersRef.current[0];
    const top = discardRef.current[discardRef.current.length - 1];
    const playable = human?.hand.filter(c => isValidPlay(c, top, activeColorRef.current)) || [];

    if (playable.length > 0) {
      setStatusText('You have playable cards highlighted in your hand!');
      return;
    }

    setIsTurnLocked(true);

    // Animated card draw from deck to human hand
    setFlyingCard({
      card: { id: `temp_draw_${Date.now()}`, color: 'wild', type: 'number', value: 0 },
      from: 'deck',
      to: 'human',
    });

    cardAudio.playDrawSound();

    setTimeout(() => {
      setFlyingCard(null);
      const drawn = drawCardsForPlayer(0, 1);
      const currentTop = discardRef.current[discardRef.current.length - 1];
      const currentColor = activeColorRef.current;

      if (drawn.length > 0 && isValidPlay(drawn[0], currentTop, currentColor)) {
        setPendingDrawnCard(drawn[0]);
        setIsTurnLocked(false);
        setStatusText(`You drew ${describeCard(drawn[0])}. Tap it to play, or keep it.`);
      } else {
        setStatusText('You drew a card. No valid play — turn passes to the next player.');
        setTimeout(() => {
          finishTurn(0, null);
        }, 1100);
      }
    }, 280);
  };

  const handleCallUno = () => {
    const human = playersRef.current[0];
    if (human && human.hand.length === 1 && !human.calledUno) {
      const copy = [...playersRef.current];
      copy[0].calledUno = true;
      syncPlayers(copy);
      cardAudio.playUnoChime();
      addLog('You shouted UNO!');
      setStatusText('UNO called successfully!');
    }
  };

  const humanPlayer = players[0] || { hand: [], calledUno: false };
  const topCard = discard[discard.length - 1];
  const canCallUno = humanPlayer.hand.length === 1 && !humanPlayer.calledUno && !gameOver;

  return (
    <div className="relative w-full max-w-lg mx-auto bg-[#FFFDF6] border border-[#173C36]/10 rounded-[32px] p-3 sm:p-4 shadow-sm flex flex-col gap-3 font-sans overflow-hidden">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between px-1">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#8B8677]">
            Smriti Game Night
          </div>
          <h2 className="text-xl font-display font-bold text-[#173C36] leading-tight">
            UNO
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              soundMuted
                ? 'bg-[#173C36]/10 text-[#173C36]/50'
                : 'bg-[#FFFBEF] border border-[#173C36]/15 text-[#E07936] shadow-xs'
            }`}
            aria-label="Toggle Card Audio"
          >
            {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={startNewGame}
            className="px-3 py-1.5 rounded-full bg-[#173C36] hover:bg-[#1f4e46] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Game</span>
          </button>
        </div>
      </div>

      {/* Status Pill */}
      <div className="text-center px-4 py-2 rounded-full bg-[#FFFBEF] border border-[#173C36]/10 shadow-xs">
        <span className="text-xs font-bold text-[#173C36] leading-snug">
          {statusText}
        </span>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Game Table Layout: Top, Left, Right Opponents + Play Center Area */}
      {/* ------------------------------------------------------------------- */}
      <div className="relative bg-gradient-to-b from-[#FFF8E7] to-[#FDF4D4] rounded-2xl border border-[#eadfb8] p-3 sm:p-4 flex flex-col justify-between min-h-[260px] sm:min-h-[300px]">
        {/* Top Opponent (Bot 2) */}
        <div className="flex justify-center">
          <div
            className={`px-3 py-1.5 rounded-2xl bg-white border flex items-center gap-2 shadow-xs transition-all ${
              currentPlayerIdx === 2
                ? 'border-[#F5C242] ring-2 ring-[#F5C242] scale-105'
                : 'border-[#173C36]/10'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-[#E3EFFC] text-[#2E6FB0] flex items-center justify-center">
              <BotIcon className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <div className="text-[11px] font-bold text-[#173C36] leading-none">
                {players[2]?.name || 'Priya'}
              </div>
              <div className="text-[9.5px] text-[#8B8677] font-semibold mt-0.5">
                {players[2]?.hand.length || 0} cards {players[2]?.calledUno && '· UNO!'}
              </div>
            </div>
          </div>
        </div>

        {/* Middle Area: Left Bot, Play Center (Deck + Discard), Right Bot */}
        <div className="flex items-center justify-between gap-2 my-2">
          {/* Left Opponent (Bot 3) */}
          <div
            className={`px-2.5 py-1.5 rounded-2xl bg-white border flex items-center gap-1.5 shadow-xs transition-all ${
              currentPlayerIdx === 3
                ? 'border-[#F5C242] ring-2 ring-[#F5C242] scale-105'
                : 'border-[#173C36]/10'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-[#FDECDA] text-[#E07936] flex items-center justify-center">
              <BotIcon className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-bold text-[#173C36] leading-none">
                {players[3]?.name || 'Dev'}
              </div>
              <div className="text-[9px] text-[#8B8677] font-semibold mt-0.5">
                {players[3]?.hand.length || 0} cards
              </div>
            </div>
          </div>

          {/* Center Play Area: Draw Deck + Indicator + Discard Pile */}
          <div className="flex items-center justify-center gap-3 sm:gap-5 relative">
            {/* Draw Deck */}
            <div className="flex flex-col items-center">
              <CardBack
                count={deck.length}
                isDeck
                isHint={currentPlayerIdx === 0 && !isTurnLocked}
                onClick={handleDrawPileClick}
              />
            </div>

            {/* Direction & Active Color Indicator */}
            <div className="flex flex-col items-center gap-1.5 px-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-500 ${
                  direction === -1 ? 'scale-x-[-1]' : ''
                }`}
                title={direction === 1 ? 'Clockwise' : 'Counter-Clockwise'}
              >
                <RotateCcw className="w-4 h-4 text-[#173C36]/70" />
              </div>

              {/* Active Color Bubble */}
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white shadow-xs border border-[#173C36]/10">
                <span
                  className="w-3 h-3 rounded-full border border-white shadow-xs"
                  style={{ backgroundColor: COLOR_HEX[activeColor] || '#999' }}
                />
                <span className="text-[10px] font-bold uppercase text-[#173C36]">
                  {activeColor}
                </span>
              </div>
            </div>

            {/* Discard Pile */}
            <div className="flex flex-col items-center">
              {topCard ? (
                <div className="animate-pop-in">
                  <CardView card={topCard} />
                </div>
              ) : (
                <div className="w-[66px] h-[96px] sm:w-[78px] sm:h-[114px] rounded-2xl border-2 border-dashed border-[#173C36]/20" />
              )}
              <span className="text-[10px] font-bold text-[#8B8677] mt-1">Play Area</span>
            </div>

            {/* Flying Card Overlay for realistic play / deal movement */}
            {flyingCard && (
              <div
                className={`absolute z-30 pointer-events-none transition-all duration-300 ease-out ${
                  flyingCard.to === 'discard'
                    ? 'animate-fly-to-discard scale-95 rotate-3'
                    : 'animate-fly-to-hand scale-100'
                }`}
              >
                <CardView card={flyingCard.card} />
              </div>
            )}
          </div>

          {/* Right Opponent (Bot 1) */}
          <div
            className={`px-2.5 py-1.5 rounded-2xl bg-white border flex items-center gap-1.5 shadow-xs transition-all ${
              currentPlayerIdx === 1
                ? 'border-[#F5C242] ring-2 ring-[#F5C242] scale-105'
                : 'border-[#173C36]/10'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-[#E1F5EE] text-[#2F9E76] flex items-center justify-center">
              <BotIcon className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-bold text-[#173C36] leading-none">
                {players[1]?.name || 'Aarav'}
              </div>
              <div className="text-[9px] text-[#8B8677] font-semibold mt-0.5">
                {players[1]?.hand.length || 0} cards
              </div>
            </div>
          </div>
        </div>

        {/* Player Indicator & Action Hints */}
        <div className="flex items-center justify-between text-xs px-2 pt-1 border-t border-[#173C36]/10">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-[#173C36] text-white flex items-center justify-center text-[10px] font-bold">
              <User className="w-3 h-3 text-[#F5C244]" />
            </div>
            <span className="font-bold text-[#173C36]">Your Hand</span>
            <span className="text-[#8B8677]">({humanPlayer.hand.length} cards)</span>
          </div>

          {/* Keep button if drawn card isn't played */}
          {pendingDrawnCard && (
            <button
              onClick={() => {
                setPendingDrawnCard(null);
                finishTurn(0, null);
              }}
              className="px-3 py-1 rounded-full bg-[#173C36] text-white font-bold text-[11px] hover:bg-[#1f4e46]"
            >
              Keep Card &amp; Pass
            </button>
          )}

          {canCallUno && (
            <button
              onClick={handleCallUno}
              className="px-3 py-1 rounded-full bg-[#F5C242] text-[#16332C] font-black text-xs shadow-md animate-bounce"
            >
              Shout UNO!
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Player's Card Hand (Horizontal scroll with high-visibility spacing & senior aids) */}
      {/* ------------------------------------------------------------------- */}
      {(() => {
        const isHumanActiveTurn = currentPlayerIdx === 0 && !isTurnLocked && !gameOver && !isDealingPhase;
        const playableCardsCount = humanPlayer.hand.filter(c => isValidPlay(c, topCard, activeColor)).length;

        return (
          <div className="flex flex-col gap-2">
            {/* Clear Visual Helper Prompt for Seniors */}
            {isHumanActiveTurn && (
              <div className="flex items-center justify-center px-2">
                {playableCardsCount > 0 ? (
                  <div className="flex items-center gap-1.5 py-1 px-3.5 bg-[#FFF9E5] border border-[#F5C242] rounded-full shadow-xs text-xs font-bold text-[#173C36] animate-pulse">
                    <Sparkles className="w-3.5 h-3.5 text-[#E07936] shrink-0" />
                    <span>
                      {playableCardsCount === 1
                        ? '1 matching card! Tap the raised, glowing card below to play.'
                        : `${playableCardsCount} matching cards! Tap any raised, glowing card below to play.`}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 py-1 px-3.5 bg-[#FFF0E6] border border-[#E07936]/40 rounded-full shadow-xs text-xs font-bold text-[#D64545]">
                    <span>No matching cards. Tap the deck above to draw a card!</span>
                  </div>
                )}
              </div>
            )}

            <div className="w-full overflow-x-auto pt-7 pb-3 px-2 scrollbar-none">
              <div className="flex items-end justify-start sm:justify-center min-w-max px-4">
                {humanPlayer.hand.map((card, idx) => {
                  const isPlayable = isHumanActiveTurn && isValidPlay(card, topCard, activeColor);
                  const isDimmed = isHumanActiveTurn && playableCardsCount > 0 && !isPlayable;

                  return (
                    <div
                      key={`${card.id}_${idx}`}
                      className="transition-all duration-300"
                      style={{
                        marginLeft: idx === 0 ? 0 : isPlayable ? '-10px' : '-20px',
                        zIndex: isPlayable ? 40 + idx : idx,
                      }}
                    >
                      <CardView
                        card={card}
                        isPlayable={isPlayable}
                        isDimmed={isDimmed}
                        onClick={() => handleHumanCardClick(card)}
                        isDealing={isDealingPhase}
                        dealDelayMs={idx * 60}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Recent Match Logs */}
      <div className="px-3 py-2 rounded-xl bg-[#FFFBEF] border border-[#173C36]/5 max-h-16 overflow-y-auto text-[10.5px] text-[#8B8677] leading-relaxed">
        {logs.map((log, i) => (
          <div key={`log_${i}_${log.slice(0, 10)}`} className="truncate">
            • {log}
          </div>
        ))}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Wild Color Selection Modal */}
      {/* ------------------------------------------------------------------- */}
      {pendingWildCard && (
        <div className="absolute inset-0 z-40 bg-[#16332C]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFCF2] rounded-3xl p-5 border border-[#173C36]/10 text-center max-w-xs w-full shadow-2xl space-y-3 animate-in zoom-in-95">
            <h3 className="font-display font-bold text-base text-[#173C36]">
              Choose a Color
            </h3>
            <p className="text-xs text-[#8B8677]">
              Select which color should continue the match:
            </p>
            <div className="grid grid-cols-2 gap-3 pt-1">
              {(['red', 'yellow', 'green', 'blue'] as UnoColor[]).map(c => (
                <button
                  key={c}
                  onClick={() => handleWildColorSelect(c)}
                  className="py-3 rounded-2xl text-white font-bold text-xs uppercase shadow-sm transition-transform active:scale-95 flex items-center justify-center gap-1.5"
                  style={{ backgroundColor: COLOR_HEX[c] }}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-white/90" />
                  <span>{c}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Game Over Modal */}
      {/* ------------------------------------------------------------------- */}
      {gameOver && (
        <div className="absolute inset-0 z-40 bg-[#16332C]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFCF2] rounded-3xl p-6 border border-[#173C36]/10 text-center max-w-xs w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-[#FFF3D2] text-[#E07936] flex items-center justify-center mx-auto shadow-xs">
              <Trophy className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-display font-bold text-[#173C36]">
                {winnerIdx === 0 ? 'You Won! 🎉' : `${players[winnerIdx!]?.name} Wins!`}
              </h3>
              <p className="text-xs text-[#8B8677] mt-1 leading-relaxed">
                {winnerIdx === 0
                  ? 'Great strategy and quick decisions! Ready for another round?'
                  : 'Well played! Card games help maintain cognitive agility and focus.'}
              </p>
            </div>

            <button
              onClick={startNewGame}
              className="w-full py-3 rounded-full bg-[#173C36] hover:bg-[#1f4e46] text-white font-bold text-sm shadow-md transition-transform active:scale-98"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
