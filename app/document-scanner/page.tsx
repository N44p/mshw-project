"use client"
import { useRef, useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { 
  Camera, RefreshCw, FileText, AlertCircle, 
  Scan, X, CheckCircle2, ShieldCheck, Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function DocumentScannerPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const [status, setStatus] = useState<'idle' | 'streaming' | 'captured'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

  // 1. تنظيف الكاميرا (مهم جداً لمنع تعليق النظام)
  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  // 2. تفعيل الكاميرا مع معالجة الإذن فوراً
  const startCamera = async () => {
    setError(null);
    setCapturedImage(null);
    
    try {
      // إجبار المتصفح على فتح طلب الإذن
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // ننتظر حتى يبدأ الفيديو فعلياً قبل تغيير الحالة
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setStatus('streaming');
        };
      }
    } catch (err: any) {
      console.error("Camera Error:", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError("يرجى الضغط على 'سماح' أعلى المتصفح لتشغيل الكاميرا.");
      } else {
        setError("تعذر الوصول للكاميرا. تأكد من إغلاق أي تطبيق آخر يستخدمها.");
      }
      setStatus('idle');
    }
  };

  // 3. التقاط الصورة
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        setCapturedImage(canvas.toDataURL("image/jpeg", 0.9));
        stopCamera();
        setStatus('captured');
      }
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return (
    <DashboardLayout title="ماسح المستندات" description="التقط مستنداتك بوضوح فائق">
      <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col items-center">
        
        {/* شاشة العرض الذكية */}
        <div className={cn(
          "relative w-full aspect-[3/4] bg-slate-950 rounded-[3rem] overflow-hidden border-[6px] border-white shadow-2xl transition-all duration-500",
          status === 'streaming' ? "ring-[12px] ring-blue-500/10" : "ring-0"
        )}>
          
          {/* حالة البداية */}
          {status === 'idle' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-gradient-to-b from-slate-900 to-black text-white">
              <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <Scan size={40} className="text-blue-400" />
              </div>
              <h3 className="text-2xl font-black mb-2">الماسح الضوئي الذكي</h3>
              <p className="text-slate-400 text-sm">اضغط على الزر أدناه لبدء عملية المسح</p>
            </div>
          )}

          {/* حالة الكاميرا المباشرة */}
          {status === 'streaming' && (
            <div className="relative w-full h-full">
              <video 
                ref={videoRef} 
                playsInline 
                muted 
                className="w-full h-full object-cover"
              />
              {/* Overlay للتحديد */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[85%] h-[80%] border-2 border-white/40 border-dashed rounded-2xl relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 -mt-1 -ml-1 rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 -mt-1 -mr-1 rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 -mb-1 -ml-1 rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 -mb-1 -mr-1 rounded-br-lg" />
                </div>
              </div>
              {/* خط المسح المتحرك */}
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-400/50 shadow-[0_0_15px_blue] animate-scan-line z-20" />
            </div>
          )}

          {/* حالة عرض النتيجة */}
          {status === 'captured' && capturedImage && (
            <div className="absolute inset-0 bg-slate-100 p-4 flex flex-col items-center justify-center animate-in fade-in duration-300">
              <img src={capturedImage} className="max-h-full rounded-2xl shadow-xl border-4 border-white" alt="Result" />
              <div className="absolute top-6 right-6 bg-emerald-500 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold shadow-lg">
                <CheckCircle2 size={16} /> تم الحفظ مؤقتاً
              </div>
            </div>
          )}

          {/* زر الرجوع/الإلغاء */}
          {status !== 'idle' && (
            <button 
              onClick={() => { stopCamera(); setStatus('idle'); }}
              className="absolute top-6 left-6 z-30 p-3 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* لوحة التحكم */}
        <div className="mt-8 w-full max-w-sm flex flex-col gap-4">
          {status === 'idle' && (
            <Button 
              onClick={startCamera} 
              className="h-20 bg-blue-600 hover:bg-blue-700 text-xl font-black rounded-[2rem] shadow-xl shadow-blue-200 transition-transform active:scale-95 gap-3"
            >
              <Camera size={24} /> فتح الكاميرا الآن
            </Button>
          )}

          {status === 'streaming' && (
            <div className="flex flex-col items-center gap-4">
               <button 
                onClick={capturePhoto}
                className="w-24 h-24 rounded-full border-8 border-slate-100 bg-blue-600 flex items-center justify-center shadow-2xl active:scale-90 transition-all"
              >
                <div className="w-16 h-16 rounded-full border-2 border-white/40" />
              </button>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">اضغط لالتقاط المستند</span>
            </div>
          )}

          {status === 'captured' && (
            <div className="flex gap-3">
              <Button className="flex-1 h-16 bg-slate-900 rounded-2xl text-lg font-bold gap-2">
                <FileText size={20} /> حفظ PDF
              </Button>
              <Button 
                variant="outline" 
                onClick={startCamera} 
                className="h-16 w-16 rounded-2xl border-2 hover:bg-slate-50"
              >
                <RefreshCw size={20} />
              </Button>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
            <ShieldCheck size={14} className="text-emerald-500" /> معالجة فورية آمنة
          </div>
        </div>

        {/* رسائل التنبيه */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-in slide-in-from-bottom-2">
            <AlertCircle size={20} />
            <span className="text-sm font-bold leading-tight">{error}</span>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <style jsx global>{`
        @keyframes scan-line {
          0% { top: 0%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan-line {
          animation: scan-line 2.5s ease-in-out infinite;
        }
      `}</style>
    </DashboardLayout>
  )
}