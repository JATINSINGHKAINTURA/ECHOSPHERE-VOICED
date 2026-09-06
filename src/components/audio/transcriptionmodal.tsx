import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Copy, Check, Send, Sparkles, Clock, Trash2, X } from 'lucide-react';
import { voiceService } from '../../services/voiceservice.js';
import { transcribeAudio } from '../../services/transcribeservice.js';
import {
  saveTranscription,
  fetchUserTranscriptions,
  type SavedTranscription,
} from '../../services/firebaseservice.js';
import type { User } from 'firebase/auth';

interface TranscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onSendToChat: (text: string) => void;
}

export const TranscriptionModal: React.FC<TranscriptionModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSendToChat,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [currentTranscription, setCurrentTranscription] = useState('');
  const [copied, setCopied] = useState(false);
  const [savedTranscriptions, setSavedTranscriptions] = useState<SavedTranscription[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Timer for recording
  useEffect(() => {
    let timer: any;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } else {
      setRecordSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  // Load saved transcriptions if logged in
  useEffect(() => {
    if (isOpen && currentUser) {
      fetchUserTranscriptions(currentUser.uid).then(setSavedTranscriptions);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleStartRecording = async () => {
    setErrorMsg(null);
    setCurrentTranscription('');
    try {
      setIsRecording(true);
      await voiceService.startRecordingAudio(
        async (base64Audio, mimeType) => {
          setIsRecording(false);
          setIsTranscribing(true);
          try {
            const res = await transcribeAudio(base64Audio, mimeType);
            setCurrentTranscription(res.text);

            if (currentUser) {
              const saved = await saveTranscription(currentUser.uid, res.text);
              setSavedTranscriptions((prev) => [saved, ...prev]);
            }
          } catch (err: any) {
            setErrorMsg(err.message || 'Transcription failed.');
          } finally {
            setIsTranscribing(false);
          }
        },
        (err) => {
          setIsRecording(false);
          setErrorMsg(err.message || 'Microphone error.');
        }
      );
    } catch (err: any) {
      setIsRecording(false);
      setErrorMsg(err.message || 'Failed to start microphone.');
    }
  };

  const handleStopRecording = () => {
    voiceService.stopRecordingAudio();
    setIsRecording(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Sparkles size={16} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                Audio Transcription
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  gemini-3.5-transcribe
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Capture microphone audio and transcribe with Gemini 3.5 Transcribe
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Recorder Card */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 text-center space-y-4">
            <button
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              disabled={isTranscribing}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                isRecording
                  ? 'bg-red-500/20 text-red-400 border-2 border-red-500 ring-8 ring-red-500/10 animate-pulse'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20'
              } disabled:opacity-50`}
            >
              {isRecording ? <MicOff size={32} /> : <Mic size={32} />}
            </button>

            <div>
              <div className="text-sm font-medium text-zinc-200">
                {isRecording
                  ? `Recording (${formatTime(recordSeconds)})... Click to Stop`
                  : isTranscribing
                  ? 'Transcribing audio with gemini-3.5-transcribe...'
                  : 'Click microphone to record audio'}
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                {isRecording
                  ? 'Speak clearly into your microphone'
                  : 'High accuracy speech-to-text powered by Google Gemini'}
              </p>
            </div>

            {isTranscribing && (
              <div className="flex items-center gap-2 text-xs text-purple-400">
                <span className="inline-block w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                <span>Processing transcription via Gemini 3.5 Transcribe...</span>
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
              {errorMsg}
            </div>
          )}

          {/* Current Transcription Result */}
          {currentTranscription && (
            <div className="p-4 rounded-xl bg-zinc-950/80 border border-purple-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-purple-300">Transcription Result</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(currentTranscription)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs transition-colors"
                  >
                    {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => {
                      onSendToChat(currentTranscription);
                      onClose();
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs transition-colors"
                  >
                    <Send size={12} />
                    <span>Send to Chat</span>
                  </button>
                </div>
              </div>
              <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">
                {currentTranscription}
              </p>
            </div>
          )}

          {/* Saved History from Firestore */}
          {currentUser && savedTranscriptions.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-medium text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Clock size={13} />
                  Firestore Saved Transcriptions
                </span>
                <span className="text-[11px] text-zinc-500">{savedTranscriptions.length} items</span>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {savedTranscriptions.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-xl bg-zinc-950/40 border border-zinc-800/80 flex items-start justify-between gap-3 text-xs group"
                  >
                    <div className="flex-1 space-y-1">
                      <p className="text-zinc-300 line-clamp-2">{t.text}</p>
                      <span className="text-[10px] text-zinc-500">
                        {new Date(t.timestamp).toLocaleDateString()} at{' '}
                        {new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleCopy(t.text)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                        title="Copy"
                      >
                        <Copy size={12} />
                      </button>
                      <button
                        onClick={() => {
                          onSendToChat(t.text);
                          onClose();
                        }}
                        className="p-1.5 rounded-lg text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors"
                        title="Send to Chat"
                      >
                        <Send size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
