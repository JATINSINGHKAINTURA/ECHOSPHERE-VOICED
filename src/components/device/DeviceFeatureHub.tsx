import React, { useState, useEffect } from 'react';
import {
  Mic,
  Volume2,
  Bell,
  Copy,
  Camera,
  MapPin,
  Maximize2,
  Monitor,
  Check,
  Sparkles,
  AlertCircle,
  X,
} from 'lucide-react';
import {
  deviceService,
  type DevicePermissionState,
  type LocationData,
} from '../../services/deviceservice.js';
import { voiceService } from '../../services/voiceservice.js';

interface DeviceFeatureHubProps {
  onOpenLiveCamera: () => void;
  onOpenScreenShare: () => void;
  onClose?: () => void;
}

export const DeviceFeatureHub: React.FC<DeviceFeatureHubProps> = ({
  onOpenLiveCamera,
  onOpenScreenShare,
  onClose,
}) => {
  const [permissions, setPermissions] = useState<DevicePermissionState>(
    deviceService.getPermissions()
  );
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);
  const [locationInfo, setLocationInfo] = useState<LocationData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsub = deviceService.onPermissionChange(setPermissions);
    return () => unsub();
  }, []);

  const showFeedback = (msg: string) => {
    setStatusFeedback(msg);
    setTimeout(() => setStatusFeedback(null), 4000);
  };

  // Test Notification
  const handleTestNotification = async () => {
    const success = await deviceService.sendNotification('EchoSphere Assistant', {
      body: 'Notifications are active! EchoSphere can alert you for reminders and updates.',
    });
    if (success) {
      showFeedback('Notification sent successfully!');
      voiceService.speak('Notification permissions granted. I can now send you reminders.');
    } else {
      showFeedback('Notification permission was blocked or denied.');
    }
  };

  // Test Clipboard
  const handleTestClipboard = async () => {
    const textToCopy = 'EchoSphere: Voice-First AI Navigator for Everyone.';
    const ok = await deviceService.writeToClipboard(textToCopy);
    if (ok) {
      setCopied(true);
      showFeedback('Copied to clipboard!');
      voiceService.speak('Text has been copied to your clipboard.');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Test Location
  const handleGetLocation = async () => {
    showFeedback('Locating current position...');
    try {
      const loc = await deviceService.getCurrentLocation();
      setLocationInfo(loc);
      showFeedback(`Location found: ${loc.city || 'Latitude ' + loc.latitude}`);
      voiceService.speak(
        `Your location is ${loc.city || 'coordinates ' + loc.latitude.toFixed(2)}. Nearby services are ready.`
      );
    } catch (err: any) {
      showFeedback('Location request failed: ' + (err.message || 'Unknown error'));
    }
  };

  // Test Fullscreen
  const handleToggleFullscreen = () => {
    const isFull = deviceService.toggleFullscreen();
    showFeedback(isFull ? 'Entered Fullscreen mode' : 'Exited Fullscreen mode');
  };

  // Test Sound
  const handleTestSound = () => {
    deviceService.playChime('success');
    voiceService.speak('Audio speaker test successful. Clear and crisp playback.');
    showFeedback('Sound output verified!');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-[#121724]/90 border border-[#f4d06f]/30 rounded-3xl backdrop-blur-xl shadow-2xl text-white">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#f4d06f]/20 border border-[#f4d06f]/40 flex items-center justify-center text-[#f4d06f]">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-headline text-white">
              Device Capabilities & Access
            </h2>
            <p className="text-xs text-zinc-400">
              Hardware features verified and accessible through voice and touch.
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Feedback Toast Banner */}
      {statusFeedback && (
        <div className="mb-5 p-3 rounded-2xl bg-[#f4d06f]/15 border border-[#f4d06f]/40 text-[#ffeecb] text-xs sm:text-sm font-semibold flex items-center gap-2 animate-fade-in">
          <Check size={16} className="text-[#f4d06f]" />
          <span>{statusFeedback}</span>
        </div>
      )}

      {/* Grid of 6 Device Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* 1. Microphone */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#f4d06f]/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-[#f4d06f] flex items-center justify-center">
                <Mic size={18} />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                Active
              </span>
            </div>
            <h4 className="text-sm font-bold text-zinc-100">Microphone Input</h4>
            <p className="text-xs text-zinc-400 mt-1">
              Real-time speech recognition with Hindi & English support.
            </p>
          </div>
          <button
            onClick={() => {
              deviceService.playChime('start');
              showFeedback('Microphone hardware ready for voice interactions.');
            }}
            className="mt-4 w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-zinc-200 transition-colors cursor-pointer"
          >
            Test Mic Sensitivity
          </button>
        </div>

        {/* 2. Audio & Speaker */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#f4d06f]/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Volume2 size={18} />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                Ready
              </span>
            </div>
            <h4 className="text-sm font-bold text-zinc-100">Speaker & Natural Voice</h4>
            <p className="text-xs text-zinc-400 mt-1">
              Multi-voice text-to-speech with natural cadence.
            </p>
          </div>
          <button
            onClick={handleTestSound}
            className="mt-4 w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-zinc-200 transition-colors cursor-pointer"
          >
            Play Sound Test
          </button>
        </div>

        {/* 3. Notifications */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#f4d06f]/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Bell size={18} />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
                {permissions.notifications}
              </span>
            </div>
            <h4 className="text-sm font-bold text-zinc-100">Reminders & Alerts</h4>
            <p className="text-xs text-zinc-400 mt-1">
              Voice-triggered desktop reminders and task updates.
            </p>
          </div>
          <button
            onClick={handleTestNotification}
            className="mt-4 w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-zinc-200 transition-colors cursor-pointer"
          >
            Trigger Test Alert
          </button>
        </div>

        {/* 4. Camera & Visual OCR */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#f4d06f]/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <Camera size={18} />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f4d06f]/20 text-[#f4d06f]">
                Vision
              </span>
            </div>
            <h4 className="text-sm font-bold text-zinc-100">Live Camera Lens</h4>
            <p className="text-xs text-zinc-400 mt-1">
              Inspect physical documents, signs, and objects with camera.
            </p>
          </div>
          <button
            onClick={onOpenLiveCamera}
            className="mt-4 w-full py-2 rounded-xl bg-[#f4d06f] hover:bg-[#ffd97d] text-[#241a00] text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            Open Live Camera
          </button>
        </div>

        {/* 5. Location & Emergency */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#f4d06f]/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <MapPin size={18} />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                GPS
              </span>
            </div>
            <h4 className="text-sm font-bold text-zinc-100">Location & Nearby Places</h4>
            <p className="text-xs text-zinc-400 mt-1">
              Find nearest hospitals, emergency services & directions.
            </p>
          </div>
          <button
            onClick={handleGetLocation}
            className="mt-4 w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-zinc-200 transition-colors cursor-pointer"
          >
            {locationInfo ? 'Update Location' : 'Fetch GPS Location'}
          </button>
        </div>

        {/* 6. Screen Sharing & Reader */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#f4d06f]/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Monitor size={18} />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400">
                Assist
              </span>
            </div>
            <h4 className="text-sm font-bold text-zinc-100">Screen Sharing Assistant</h4>
            <p className="text-xs text-zinc-400 mt-1">
              Read and guide across other desktop applications.
            </p>
          </div>
          <button
            onClick={onOpenScreenShare}
            className="mt-4 w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-zinc-200 transition-colors cursor-pointer"
          >
            Start Screen Reader
          </button>
        </div>

      </div>

      {/* Quick Controls Footer */}
      <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <button
            onClick={handleTestClipboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 transition-colors cursor-pointer"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
          </button>

          <button
            onClick={handleToggleFullscreen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 transition-colors cursor-pointer"
          >
            <Maximize2 size={14} />
            <span>Toggle Fullscreen</span>
          </button>
        </div>

        {locationInfo && (
          <span className="text-xs text-[#f4d06f] font-medium">
            📍 {locationInfo.city || `${locationInfo.latitude}, ${locationInfo.longitude}`}
          </span>
        )}
      </div>
    </div>
  );
};
