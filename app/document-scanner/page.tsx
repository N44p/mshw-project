"use client"
import { useRef, useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { 
  Camera, RefreshCw, FileText, X, Check, 
  Frame, ZoomIn, Layers, Shield
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function FullScreenScanner() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const [status, setStatus] = useState<'idle' | 'streaming' | 'captured'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment", width: { ideal: 4096 }, height: { ideal: 2160 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStatus('streaming');
      }
    } catch (err) {
      setError("فشل الوصول للكاميرا. تأكد من الأذونات.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d")?.drawImage(video, 0, 0);
      setCapturedImage(canvas.toDataURL("image/jpeg", 1.0));
      setStatus('captured');
    }
  };

  return (
    <div className="fixed inset-0 bg-black overflow-hidden flex flex-col items-center justify-center text-white">
      
      {/* 1. طبقة الكاميرا الخلفية - Full Screen */}
      <div className="absolute inset-0 z-0">
        {status === 'streaming' && (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
        )}
        {status === 'captured' && capturedImage && (
          <img src={capturedImage} className="w-full h-full object-cover animate-in fade-in duration-500" alt="Captured" />
        )}
        
        {/* طبقة التعتيم الجمالية (Vignette) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
      </div>

      {/* 2. عناصر واجهة التصميم المعقدة (HUD Interface) */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between p-6 pointer-events-none">
        
        {/* الجزء العلوي: معلومات تقنية */}
        <div className="flex justify-between items-start pt-4">
          <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 pointer-events-auto">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase">Rec: Ultra_HD_4K</span>
            </div>
            <p className="text-[9px] text-blue-400 font-mono mt-1">ISO: AUTO | 60 FPS</p>
          </div>
          
          <button 
            onClick={() => window.location.reload()}
            className="p-4 bg-black/40 backdrop-blur-md rounded-full border border-white/10 pointer-events-auto hover:bg-white/10 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* الجزء الأوسط: إطار التركيز (Focus Frame) */}
        <div className="relative flex-1 flex items-center justify-center">
            <div className="w-full max-w-lg aspect-[3/4] relative border border-white/5">
                {/* زوايا معقدة */}
                <div className="absolute -top-2 -left-2 w-12 h-12 border-t-2 border-l-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                <div className="absolute -top-2 -right-2 w-12 h-12 border-t-2 border-r-2 border-blue-500" />
                <div className="absolute -bottom-2 -left-2 w-12 h-12 border-b-2 border-l-2 border-blue-500" />
                <div className="absolute -bottom-2 -right-2 w-12 h-12 border-b-2 border-r-2 border-blue-500" />
                
                {/* مسطرة جانبية (Grid Lines) */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-20">
                    {[...Array(9)].map((_, i) => <div key={i} className="border-[0.5px] border-white/50" />)}
                </div>
            </div>
        </div>

        {/* الجزء السفلي: التحكم الرئيسي */}
        <div className="flex flex-col items-center gap-8 pb-10">
          
          {/* شريط الأدوات العائم */}
          <div className="flex gap-4 bg-black/60 backdrop-blur-2xl px-6 py-3 rounded-3xl border border-white/10 pointer-events-auto">
             <button className="p-2 text-slate-400 hover:text-white"><Frame size={18} /></button>
             <div className="w-[1px] bg-white/10" />
             <button className="p-2 text-slate-400 hover:text-white"><ZoomIn size={18} /></button>
             <div className="w-[1px] bg-white/10" />
             <button className="p-2 text-slate-400 hover:text-white"><Layers size={18} /></button>
          </div>

          {/* زر التصوير الكبير */}
          <div className="flex items-center gap-12 pointer-events-auto">
            {status === 'streaming' ? (
                <button 
                onClick={capturePhoto}
                className="w-24 h-24 rounded-full border-[6px] border-white/20 p-1 group transition-transform active:scale-90"
              >
                <div className="w-full h-full bg-white rounded-full shadow-[0_0_30px_rgba(255,255,255,0.4)] group-hover:bg-blue-50" />
              </button>
            ) : status === 'captured' ? (
                <div className="flex gap-4">
                    <Button onClick={() => setStatus('streaming')} className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20">
                        <RefreshCw size={24} />
                    </Button>
                    <Button className="h-16 px-10 rounded-full bg-emerald-500 hover:bg-emerald-600 text-lg font-bold gap-3 shadow-lg shadow-emerald-500/20">
                        <Check size={24} /> حفظ المستند
                    </Button>
                </div>
            ) : (
                <Button onClick={startCamera} className="h-20 px-12 rounded-full bg-blue-600 hover:bg-blue-700 text-xl font-black shadow-2xl shadow-blue-500/40 gap-4">
                    <Camera size={28} /> تفعيل العدسة
                </Button>
            )}
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono text-white/40 tracking-widest uppercase">
            <Shield size={12} /> Secure Hardware Acceleration
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
      
      {/* رسالة الخطأ */}
      {error && (
        <div className="absolute top-1/2 bg-red-600 p-4 rounded-xl z-50 text-sm font-bold animate-bounce">
            {error}
        </div>
      )}
    </div>
  )
}