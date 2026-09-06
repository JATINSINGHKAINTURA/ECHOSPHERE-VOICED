import React, { useState, useRef, useEffect } from 'react';
import { Monitor, X, Volume2, Sparkles, AlertCircle, StopCircle } from 'lucide-react';
import { deviceService } from '../../services/deviceservice.js';
import { voiceService } from '../../services/voiceservice.js';

interface ScreenShareModalProps {
  onClose: () => void;
}

export const ScreenShareModal: React.FC<ScreenShareModalProps> = ({ onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    startScreenShare();
    return () => {
      stopScreenShare();
    };
  }, []);

  const startScreenShare = async () => {
    setErrorMsg(null);
    try {
      const mediaStream = await deviceService.getScreenStream();
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      voiceService.speak(
        'Screen sharing active. EchoSphere is monitoring your screen to assist with reading and navigation.'
      );
    } catch (err: any) {
      setErrorMsg(err?.message || 'Screen sharing cancelled or unavailable.');
    }
  };

  const stopScreenShare = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#0f1422] border border-[#f4d06f]/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#161b29]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Monitor size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold font-headline text-white">Screen Reader Assistant</h3>
              <p className="text-xs text-zinc-400">Live assistive screen guidance and text reader.</p>
            </div>
          </div>

          <button
            onClick={() => {
              stopScreenShare();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Video Canvas */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
          {errorMsg ? (
            <div className="p-6 text-center text-rose-400 space-y-2">
              <AlertCircle size={32} className="mx-auto text-rose-500" />
              <p className="text-sm font-semibold">{errorMsg}</p>
              <button
                onClick={startScreenShare}
                className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs text-white"
              >
                Start Screen Share
              </button>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-contain"
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-5 bg-[#111624] border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-zinc-400 flex items-center gap-2">
            <Sparkles size={14} className="text-[#f4d06f]" />
            EchoSphere can read text visible on your shared screen aloud.
          </span>

          <button
            onClick={() => {
              stopScreenShare();
              onClose();
            }}
            className="px-5 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <StopCircle size={16} />
            <span>Stop Sharing</span>
          </button>
        </div>

      </div>
    </div>
  );
};
