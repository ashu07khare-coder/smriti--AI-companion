import React, { useState, useEffect, useRef } from 'react';
import { LanguageCode, UserProfile, Reminder, FamilyMember } from '../types';
import { bhashiniVoice } from '../utils/bhashiniVoice';
import { smritiAi, SmritiChatMessage } from '../utils/smritiAiService';
import {
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Send,
  RotateCcw,
  Bot,
  User,
  Heart,
  MessageCircle,
} from 'lucide-react';

interface SpeakWithSmritiModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  currentLanguage: LanguageCode;
  reminders: Reminder[];
  familyMembers: FamilyMember[];
}

export const SpeakWithSmritiModal: React.FC<SpeakWithSmritiModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  currentLanguage,
  reminders,
  familyMembers,
}) => {
  const [messages, setMessages] = useState<SmritiChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionInstanceRef = useRef<any>(null);
  const finalTranscriptRef = useRef<string>('');

  // Initialize conversation when modal opens
  useEffect(() => {
    if (isOpen) {
      bhashiniVoice.playGentleTone('chime');
      const greeting = smritiAi.getInitialGreeting({
        currentUser,
        currentLanguage,
        reminders,
        familyMembers,
      });

      const initialMsg: SmritiChatMessage = {
        id: 'msg-initial',
        sender: 'smriti',
        text: greeting,
        timestamp: Date.now(),
      };
      setMessages([initialMsg]);

      // Speak greeting via Bhashini voice engine
      setIsSpeaking(true);
      bhashiniVoice.speak(greeting, currentLanguage, () => {
        setIsSpeaking(false);
      });
    } else {
      bhashiniVoice.stop();
      if (recognitionInstanceRef.current) {
        try {
          recognitionInstanceRef.current.abort();
        } catch {}
      }
      setIsListening(false);
      setIsSpeaking(false);
      setInterimTranscript('');
      finalTranscriptRef.current = '';
    }
  }, [isOpen]);

  // Clean up recognition on unmount
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
    return () => {
      if (recognitionInstanceRef.current) {
        try {
          recognitionInstanceRef.current.abort();
        } catch {}
      }
    };
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking, interimTranscript]);

  if (!isOpen) return null;

  const handleStartListening = () => {
    bhashiniVoice.stop();
    setIsSpeaking(false);
    setInterimTranscript('');
    finalTranscriptRef.current = '';

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const promptInput = window.prompt("Speak to Smriti (Type your question):");
      if (promptInput) {
        handleSendMessage(promptInput);
      }
      return;
    }

    if (recognitionInstanceRef.current) {
      try {
        recognitionInstanceRef.current.abort();
      } catch {}
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.lang = bhashiniVoice.getSpeechRecognitionLanguage(currentLanguage);

      recognition.onstart = () => {
        setIsListening(true);
        bhashiniVoice.playGentleTone('soft');
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';
        for (let i = 0; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        if (final) {
          finalTranscriptRef.current = final;
          setInterimTranscript(final);
        } else if (interim) {
          setInterimTranscript(interim);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event?.error);
        if (event?.error === 'language-not-supported' && recognition.lang !== 'en-IN') {
          try {
            recognition.lang = 'en-IN';
            recognition.start();
            return;
          } catch {}
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        const textToProcess = finalTranscriptRef.current || interimTranscript;
        if (textToProcess && textToProcess.trim()) {
          handleSendMessage(textToProcess.trim());
          setInterimTranscript('');
          finalTranscriptRef.current = '';
        }
      };

      recognition.start();
      recognitionInstanceRef.current = recognition;
    } catch (err) {
      console.warn('Speech recognition start error:', err);
      setIsListening(false);
    }
  };

  const handleToggleListening = () => {
    if (isListening) {
      if (recognitionInstanceRef.current) {
        try {
          recognitionInstanceRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      const textToProcess = finalTranscriptRef.current || interimTranscript;
      if (textToProcess && textToProcess.trim()) {
        handleSendMessage(textToProcess.trim());
        setInterimTranscript('');
        finalTranscriptRef.current = '';
      }
    } else {
      handleStartListening();
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    bhashiniVoice.stop();
    setIsSpeaking(false);
    setInterimTranscript('');

    const userMsg: SmritiChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'patient',
      text: trimmed,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    try {
      const responseObj = await smritiAi.generateResponseDetails(
        trimmed,
        { currentUser, currentLanguage, reminders, familyMembers },
        messages
      );

      const smritiMsg: SmritiChatMessage = {
        id: 'msg-smriti-' + Date.now(),
        sender: 'smriti',
        text: responseObj.reply,
        timestamp: Date.now(),
        source: responseObj.source,
        model: responseObj.model,
        bhashiniLanguage: responseObj.bhashiniLanguage,
      };

      setMessages(prev => [...prev, smritiMsg]);
      setIsThinking(false);

      // Auto-speak response at crisp conversational pace
      setIsSpeaking(true);
      bhashiniVoice.speak(responseObj.reply, currentLanguage, () => {
        setIsSpeaking(false);
      }, undefined, 0, 1.08);
    } catch {
      setIsThinking(false);
    }
  };

  const handleReplayLatest = () => {
    const lastSmriti = [...messages].reverse().find(m => m.sender === 'smriti');
    if (lastSmriti) {
      bhashiniVoice.stop();
      setIsSpeaking(true);
      bhashiniVoice.speak(lastSmriti.text, currentLanguage, () => {
        setIsSpeaking(false);
      }, undefined, 0, 1.08);
    }
  };

  const handleStopSpeaking = () => {
    bhashiniVoice.stop();
    setIsSpeaking(false);
  };

  const suggestedPrompts = smritiAi.getSuggestedPrompts({
    currentUser,
    currentLanguage,
    reminders,
    familyMembers,
  });

  return (
    <div
      className="fixed inset-0 z-50 bg-[#16332C]/65 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="smriti-ai-title"
    >
      <div className="w-full max-w-lg bg-[#FFFDF6] sm:rounded-[36px] rounded-t-[32px] border border-[#173C36]/15 shadow-2xl flex flex-col h-[90vh] sm:h-[680px] overflow-hidden">
        {/* Top Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#FFFDF6] via-[#FFF8E7] to-[#FDECDA] border-b border-[#173C36]/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#173C36] to-[#2F9E76] text-white flex items-center justify-center shadow-sm relative">
              <Sparkles className="w-5 h-5 text-[#F5C244]" />
              {isSpeaking && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#E07936] ring-2 ring-white animate-ping" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="smriti-ai-title" className="text-base font-display font-bold text-[#173C36]">
                  Speak with Smriti
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#E1F5EE] text-[#1F8A5F] text-[10px] font-bold">
                  AI Voice
                </span>
              </div>
              <p className="text-[11px] text-[#173C36]/70 font-medium">
                {currentUser?.name || 'Aita'}'s Companion · Powered by Bhashini &amp; Gemini
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/80 border border-[#173C36]/10 text-[#173C36] flex items-center justify-center hover:bg-white active:scale-95 transition-all"
            aria-label="Close Smriti AI conversation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Living Audio Presence Banner */}
        <div className="px-5 py-3 bg-[#FFF9E8] border-b border-[#173C36]/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1">
              {[0.4, 0.8, 1, 0.6, 0.3].map((heightScale, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-300 ${
                    isSpeaking
                      ? 'bg-[#E07936] animate-pulse'
                      : isListening
                      ? 'bg-[#2F9E76] animate-bounce'
                      : 'bg-[#173C36]/20'
                  }`}
                  style={{
                    height: isSpeaking || isListening ? `${18 * heightScale}px` : '6px',
                    animationDelay: `${i * 120}ms`,
                  }}
                />
              ))}
            </div>

            <span className="text-xs font-bold text-[#173C36]">
              {isListening
                ? 'Listening to you... speak freely'
                : isSpeaking
                ? 'Smriti is speaking gently...'
                : isThinking
                ? 'Smriti is thinking warmly...'
                : 'Ready to listen whenever you tap below'}
            </span>
          </div>

          {isSpeaking && (
            <button
              onClick={handleStopSpeaking}
              className="px-2.5 py-1 rounded-full bg-[#173C36]/10 hover:bg-[#173C36]/15 text-[#173C36] text-[11px] font-bold flex items-center gap-1"
            >
              <VolumeX className="w-3 h-3" />
              <span>Quiet</span>
            </button>
          )}

          {!isSpeaking && messages.some(m => m.sender === 'smriti') && (
            <button
              onClick={handleReplayLatest}
              className="px-2.5 py-1 rounded-full bg-[#FFFDF6] border border-[#173C36]/10 text-[#173C36] text-[11px] font-bold flex items-center gap-1 hover:bg-white"
            >
              <Volume2 className="w-3 h-3 text-[#E07936]" />
              <span>Hear again</span>
            </button>
          )}
        </div>

        {/* Conversation Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scroll-smooth">
          {messages.map(msg => {
            const isSmriti = msg.sender === 'smriti';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isSmriti ? 'items-start' : 'items-end justify-end'}`}
              >
                {isSmriti && (
                  <div className="w-8 h-8 rounded-full bg-[#173C36] text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <Sparkles className="w-4 h-4 text-[#F5C244]" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-[22px] p-4 text-sm leading-relaxed shadow-xs ${
                    isSmriti
                      ? 'bg-white border border-[#173C36]/10 text-[#173C36]'
                      : 'bg-[#173C36] text-white rounded-br-none'
                  }`}
                >
                  <p className="font-medium text-[13.5px] sm:text-sm">{msg.text}</p>
                  {isSmriti && (msg.source || msg.bhashiniLanguage) && (
                    <div className="mt-2 pt-1.5 border-t border-[#173C36]/5 flex items-center gap-1.5 text-[10px] text-[#173C36]/60">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#173C36]/5 font-semibold">
                        <Sparkles className="w-2.5 h-2.5 text-[#E07936]" />
                        {msg.source === 'gemini_with_bhashini_layer'
                          ? 'Gemini + Bhashini'
                          : 'Bhashini Grounding'}
                      </span>
                      {msg.bhashiniLanguage && (
                        <span className="font-medium text-[#173C36]/50">· {msg.bhashiniLanguage}</span>
                      )}
                    </div>
                  )}
                </div>

                {!isSmriti && (
                  <div className="w-8 h-8 rounded-full bg-[#E07936] text-white flex items-center justify-center shrink-0 mb-1 shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isThinking && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#173C36] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-4 h-4 text-[#F5C244] animate-spin" />
              </div>
              <div className="bg-white border border-[#173C36]/10 rounded-[20px] px-4 py-3 text-xs text-[#173C36]/70 flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E07936] animate-ping" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E07936] animate-ping delay-150" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E07936] animate-ping delay-300" />
                </div>
                <span>Smriti is preparing a gentle answer...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Questions for Dementia Support */}
        <div className="px-4 py-2 bg-[#FFFDF6] border-t border-[#173C36]/5 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {suggestedPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(p.query)}
                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-[#FFFBEF] border border-[#173C36]/15 hover:bg-[#F5C244]/20 text-[#173C36] text-xs font-semibold active:scale-95 transition-all shrink-0"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Interactive Voice / Input Area */}
        <div className="p-4 bg-white border-t border-[#173C36]/10 shrink-0 space-y-3">
          {/* Live Heard Words Pill */}
          {isListening && (
            <div className="px-4 py-2 bg-[#E1F5EE] border border-[#2F9E76]/25 rounded-2xl flex items-center gap-2.5 text-xs text-[#173C36] animate-in fade-in slide-in-from-bottom-2">
              <span className="w-2 h-2 rounded-full bg-[#E07936] animate-ping shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="font-bold text-[#1F8A5F] mr-1.5">Hearing:</span>
                <span className="font-medium text-[#173C36] italic truncate">
                  {interimTranscript ? `"${interimTranscript}"` : 'Listening carefully... please speak'}
                </span>
              </div>
            </div>
          )}

          {/* Main Large Voice Speaking Button */}
          <div className="flex items-center justify-center gap-3">
            <button
              id="smriti-voice-talk-btn"
              onClick={handleToggleListening}
              className={`w-full py-3.5 px-6 rounded-full font-bold text-sm flex items-center justify-center gap-2.5 shadow-md transition-all active:scale-98 ${
                isListening
                  ? 'bg-[#E07936] text-white ring-4 ring-[#E07936]/30 animate-pulse'
                  : 'bg-[#173C36] hover:bg-[#1f4e46] text-white'
              }`}
              aria-label={isListening ? "Stop listening" : "Tap to speak to Smriti"}
            >
              {isListening ? (
                <>
                  <MicOff className="w-5 h-5 animate-bounce" />
                  <span>Listening... Tap when finished</span>
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5 text-[#F5C244]" />
                  <span>Tap to Speak with Smriti</span>
                </>
              )}
            </button>
          </div>

          {/* Optional Text input for typing/caregiver assistance */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Or type a message to Smriti..."
              className="flex-1 px-4 py-2.5 rounded-full bg-[#FFFDF6] border border-[#173C36]/15 text-xs text-[#173C36] focus:outline-none focus:ring-2 focus:ring-[#173C36]/30"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-9 h-9 rounded-full bg-[#F5C244] hover:bg-[#e2b037] disabled:opacity-40 text-[#173C36] flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-xs"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
