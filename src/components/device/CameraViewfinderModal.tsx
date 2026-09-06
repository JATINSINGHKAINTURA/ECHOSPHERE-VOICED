import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, Volume2, Sparkles, Check, AlertCircle } from 'lucide-react';
import { deviceService } from '../../services/deviceservice.js';
import { voiceService } from '../../services/voiceservice.js';

interface CameraViewfinderModalProps {
  onClose: () => void;
}

export const CameraViewfinderModal: React.FC<CameraViewfinderModalProps> = ({ onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setErrorMsg(null);
    try {
      const mediaStream = await deviceService.getCameraStream();
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Could not access camera device.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  };

  const handleCaptureSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(dataUrl);
      deviceService.playChime('click');
      analyzeImage();
    }
  };

  const analyzeImage = () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    // Simulated Optical Character & Object Recognition description for assistive reading
    setTimeout(() => {
      setIsAnalyzing(false);
      const description =
        'I see a clear document in view with printed text and symbols. You can hold it steady or ask me to read specific sections aloud.';
      setAnalysisResult(description);
      voiceService.speak(description);
    }, 1200);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    voiceService.interrupt();
    startCamera();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0f1422] border border-[#f4d06f]/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#161b29]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Camera size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold font-headline text-white">Camera Visual Assistant</h3>
              <p className="text-xs text-zinc-400">Point at objects or documents for instant audio guidance.</p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Viewport Canvas */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
          {errorMsg ? (
            <div className="p-6 text-center text-rose-400 space-y-2">
              <AlertCircle size={32} className="mx-auto text-rose-500" />
              <p className="text-sm font-semibold">{errorMsg}</p>
              <button
                onClick={startCamera}
                className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs text-white"
              >
                Retry Camera
              </button>
            </div>
          ) : capturedImage ? (
            <img src={capturedImage} alt="Captured snapshot" className="w-full h-full object-contain" />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          )}

          <canvas ref={canvasRef} className="hidden" />

          {/* Crosshair focus guides */}
          {!capturedImage && !errorMsg && (
            <div className="absolute inset-8 border-2 border-dashed border-[#f4d06f]/40 rounded-2xl pointer-events-none flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-[#f4d06f] rounded-full animate-ping opacity-75" />
            </div>
          )}
        </div>

        {/* Analysis Output Result */}
        {analysisResult && (
          <div className="p-4 bg-[#141a29] border-t border-white/10 flex items-start gap-3 animate-fade-in">
            <Sparkles size={18} className="text-[#f4d06f] shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-xs font-bold text-[#f4d06f] uppercase tracking-wider">
                Visual Inspection Result:
              </h4>
              <p className="text-sm text-zinc-200 mt-1 leading-relaxed">{analysisResult}</p>
            </div>
            <button
              onClick={() => voiceService.speak(analysisResult)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white"
              title="Repeat audio readout"
            >
              <Volume2 size={16} />
            </button>
          </div>
        )}

        {/* Controls Footer */}
        <div className="p-5 bg-[#111624] border-t border-white/10 flex items-center justify-between">
          <button
            onClick={capturedImage ? handleRetake : handleCaptureSnapshot}
            disabled={isAnalyzing || !!errorMsg}
            className="w-full py-3 rounded-2xl bg-[#f4d06f] hover:bg-[#ffd97d] text-[#241a00] font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(244,208,111,0.3)] transition-all cursor-pointer disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Analyzing Image with AI...</span>
              </>
            ) : capturedImage ? (
              <>
                <RefreshCw size={16} />
                <span>Take Another Photo</span>
              </>
            ) : (
              <>
                <Camera size={18} />
                <span>Capture & Describe Document</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
