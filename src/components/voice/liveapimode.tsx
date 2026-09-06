import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, X, Sparkles, Radio, MessageSquare, CornerDownLeft } from 'lucide-react';
import { voiceService } from '../../services/voiceservice.js';
import { sendLiveTurn } from '../../services/chatservice.js';

interface LiveApiModeProps {
  isOpen: boolean;
  onClose: () => void;
  languageCode: string;
  onAddToChatHistory?: (userText: string, assistantText: string) => void;
}

interface LiveTurn {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export const LiveApiMode: React.FC<LiveApiModeProps> = ({
  isOpen,
  onClose,
  languageCode,
  onAddToChatHistory,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [liveTurns, setLiveTurns] = useState<LiveTurn[]>([
    {
      role: 'model',
      text: 'Gemini Live voice session connected. Speak naturally to converse in real-time.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [transcriptPreview, setTranscriptPreview] = useState('');
  const [textInput, setTextInput] = useState('');
  const turnsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      voiceService.speak(
        'Gemini Live voice session connected. I am listening.',
        languageCode,
        () => {
          handleStartListening();
        }
      );
    } else {
      voiceService.stopListening();
      voiceService.stopSpeaking();
    }
    return () => {
      voiceService.stopListening();
      voiceService.stopSpeaking();
    };
  }, [isOpen]);

  useEffect(() => {
    turnsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [liveTurns, transcriptPreview, isThinking]);

  if (!isOpen) return null;

  const handleStartListening = () => {
    setIsListening(true);
    setTranscriptPreview('');
    voiceService.startListening(
      languageCode,
      (transcript) => {
        setTranscriptPreview(transcript);
        if (transcript.trim()) {
          // Debounce or dispatch turn
        }
      },
      (err) => {
        console.warn('Live voice recognition error:', err);
        setIsListening(false);
      }
    );
  };

  const handleStopAndSend = async (manualText?: string) => {
    const textToSend = manualText || transcriptPreview;
    voiceService.stopListening();
    setIsListening(false);
    setTranscriptPreview('');

    if (!textToSend.trim()) return;

    const userTurn: LiveTurn = {
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setLiveTurns((prev) => [...prev, userTurn]);
    setIsThinking(true);

    try {
      const history = liveTurns.map((t) => ({
        role: t.role === 'model' ? 'assistant' : 'user',
        content: t.text,
      }));

      const res = await sendLiveTurn(textToSend, history);
      const modelTurn: LiveTurn = {
        role: 'model',
        text: res.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setLiveTurns((prev) => [...prev, modelTurn]);
      setIsThinking(false);
      setIsSpeaking(true);

      onAddToChatHistory?.(textToSend, res.response);

      voiceService.speak(res.response, languageCode, () => {
        setIsSpeaking(false);
        // Automatically listen again for natural multi-turn conversation
        handleStartListening();
      });
    } catch (err) {
      setIsThinking(false);
      const errorTurn: LiveTurn = {
        role: 'model',
        text: 'Live connection turn error. Please retry.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setLiveTurns((prev) => [...prev, errorTurn]);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() || isThinking) return;
    const txt = textInput;
    setTextInput('');
    handleStopAndSend(txt);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[80vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Radio size={18} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-zinc-100">Live Voice Conversation</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  gemini-3.1-flash-live-preview
                </span>
              </div>
              <p className="text-xs text-zinc-400">Real-time low-latency bidirectional voice API</p>
            </div>
          </div>
          <button
            onClick={() => {
              voiceService.stopListening();
              voiceService.stopSpeaking();
              onClose();
            }}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Live Conversation Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {liveTurns.map((turn, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 max-w-lg ${
                turn.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  turn.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-800 text-blue-400 border border-zinc-700'
                }`}
              >
                {turn.role === 'user' ? 'YOU' : 'LIVE'}
              </div>
              <div
                className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                  turn.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-sm'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-sm'
                }`}
              >
                <p>{turn.text}</p>
                <span className="text-[10px] text-zinc-400/80 mt-1 block text-right">
                  {turn.timestamp}
                </span>
              </div>
            </div>
          ))}

          {transcriptPreview && (
            <div className="flex items-start gap-3 max-w-lg ml-auto flex-row-reverse animate-pulse">
              <div className="w-7 h-7 rounded-full bg-blue-600/50 text-white flex items-center justify-center text-[10px] font-bold">
                YOU
              </div>
              <div className="rounded-2xl rounded-tr-sm px-4 py-2.5 bg-blue-600/40 border border-blue-500/30 text-xs text-blue-100">
                <p>{transcriptPreview}...</p>
              </div>
            </div>
          )}

          {isThinking && (
            <div className="flex items-start gap-3 max-w-lg mr-auto">
              <div className="w-7 h-7 rounded-full bg-zinc-800 text-blue-400 flex items-center justify-center text-[10px] font-bold border border-zinc-700">
                LIVE
              </div>
              <div className="rounded-2xl rounded-tl-sm px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                <span>Live API streaming response...</span>
              </div>
            </div>
          )}

          <div ref={turnsEndRef} />
        </div>

        {/* Visual Audio Wave & Controls */}
        <div className="p-6 border-t border-zinc-800/80 bg-zinc-900/40 flex flex-col items-center space-y-4">
          <div className="relative flex items-center justify-center">
            {/* Pulsing rings */}
            {(isListening || isSpeaking) && (
              <div
                className={`absolute w-24 h-24 rounded-full animate-ping opacity-25 ${
                  isSpeaking ? 'bg-emerald-500' : 'bg-blue-500'
                }`}
              />
            )}
            <button
              onClick={() => {
                if (isListening) {
                  handleStopAndSend();
                } else {
                  handleStartListening();
                }
              }}
              className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-white transition-all shadow-xl ${
                isSpeaking
                  ? 'bg-emerald-600 shadow-emerald-500/30 ring-4 ring-emerald-500/20'
                  : isListening
                  ? 'bg-red-600 shadow-red-500/30 ring-4 ring-red-500/20 animate-pulse'
                  : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/30'
              }`}
            >
              {isSpeaking ? (
                <Volume2 size={26} />
              ) : isListening ? (
                <Mic size={26} />
              ) : (
                <MicOff size={26} />
              )}
            </button>
          </div>

          <div className="text-center">
            <span className="text-xs font-medium text-zinc-300">
              {isSpeaking
                ? 'Gemini Live speaking...'
                : isThinking
                ? 'Processing live audio turn...'
                : isListening
                ? 'Listening... Click button or stop talking to send'
                : 'Click microphone to speak'}
            </span>
          </div>

          {/* Quick text fallback */}
          <form onSubmit={handleTextSubmit} className="w-full flex items-center gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Or type a live turn..."
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={!textInput.trim() || isThinking}
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 text-xs flex items-center gap-1"
            >
              <CornerDownLeft size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
