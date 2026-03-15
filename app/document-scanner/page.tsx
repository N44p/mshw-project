"use client"
import { useRef, useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { 
  Camera, RefreshCw, FileText, AlertCircle, 
  Scan, X, Download, ShieldCheck, Sparkles, CheckCircle2
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function DocumentScannerPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // حالات الصفحة: idle (البداية)، streaming (الكاميرا تعمل)، captured (تم الالتقاط)
  const [status, setStatus] = useState<'idle' | 'streaming' | 'captured'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

  // وظيفة إيقاف الكاميرا بذكاء
  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  // تشغيل الكاميرا - ستطلق "إشعار السماح" الخاص بالمتصفح فوراً
  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "environment", // استخدام الكاميرا الخلفية في الجوالات
          width: { ideal: 1920 }, 
          height: { ideal: 1080 } 
        } 
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStatus('streaming');
      }
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        setError("تحتاج لإعطاء إذن الكاميرا من الرسالة التي ظهرت في المتصفح.");
      } else {
        setError("لم نتمكن من العثور على كاميرا نشطة.");
      }
    }
  };

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

  // تنظيف الذاكرة عند إغلاق الصفحة
  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return (
    <DashboardLayout title="الماسح الذكي" description="تجربة مسح ضوئي فورية وآمنة">
      <div className="max-w-2xl mx-auto px-4 py-8">
        
        {/* منطقة العرض الرئيسية */}
        <div 
          ref={containerRef}
          className={cn(
            "relative overflow-hidden rounded-[3rem] transition-all duration-700 bg-slate-900 shadow-2xl border-8 border-white group",
            status === 'streaming' ? "ring-8 ring-indigo-50" : "ring-0"
          )}
        >
          {/* 1. واجهة البداية (Idle) - تشجع المستخدم على البدء */}
          {status === 'idle' && (
            <div className="aspect-[3/4] flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-black text-white p-8 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse" />
                <div className="relative p-6 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20">
                  <Scan size={60} className="text-indigo-300" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">جاهز للمسح الضوئي؟</h3>
              <p className="text-slate-400 text-sm max-w-[250px] leading-relaxed">
                اضغط على الزر أدناه للسماح باستخدام الكاميرا.
              </p>
            </div>
          )}

          {/* 2. واجهة البث المباشر (Streaming) */}
          {status === 'streaming' && (
            <div className="relative aspect-[3/4]">
              <video 
                ref={videoRef} 
                autoPlay muted playsInline 
                className="w-full h-full object-cover shadow-inner" 
              />
              {/* تأثير الماسح الضوئي */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-indigo-500/20 to-transparent animate-scan-slow" />
                <div className="absolute inset-12 border-2 border-white/30 rounded-2xl border-dashed" />
              </div>
              {/* زر الإلغاء السريع */}
              <button 
                onClick={() => { stopCamera(); setStatus('idle'); }}
                className="absolute top-6 left-6 p-3 bg-black/40 backdrop-blur-md text-white rounded-full hover:bg-red-500/60 transition"
              >
                <X size={20} />
              </button>
            </div>
          )}

          {/* 3. واجهة النتيجة (Captured) */}
          {status === 'captured' && capturedImage && (
            <div className="relative aspect-[3/4] bg-slate-100 p-4 flex items-center justify-center">
              <img src={capturedImage} className="max-h-full rounded-xl shadow-lg border" alt="Result" />
              <div className="absolute top-6 right-6 flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                <CheckCircle2 size={16} /> تم الالتقاط
              </div>
            </div>
          )}
        </div>

        {/* لوحة التحكم السفلية */}
        <div className="mt-10 max-w-sm mx-auto flex flex-col items-center gap-6">
          {status === 'idle' && (
            <Button 
              onClick={startCamera} 
              className="w-full h-16 text-lg font-black rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 gap-2 transition-all hover:scale-[1.02]"
            >
              <Sparkles size={20} /> تفعيل الكاميرا الآن
            </Button>
          )}

          {status === 'streaming' && (
            <div className="flex flex-col items-center gap-4">
              <button 
                onClick={capturePhoto}
                className="w-24 h-24 rounded-full border-8 border-slate-100 bg-indigo-600 flex items-center justify-center shadow-2xl active:scale-90 transition-transform group"
              >
                <div className="w-16 h-16 rounded-full border-2 border-white/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Camera className="text-white" size={32} />
                </div>
              </button>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">اضغط للالتقاط</p>
            </div>
          )}

          {status === 'captured' && (
            <div className="w-full grid grid-cols-4 gap-3">
              <Button className="col-span-3 h-16 rounded-2xl bg-slate-900 hover:bg-black text-lg font-bold gap-2">
                <FileText size={20} /> حفظ بصيغة PDF
              </Button>
              <Button 
                variant="outline" 
                onClick={startCamera}
                className="h-16 rounded-2xl border-2 border-slate-200 hover:bg-slate-50"
              >
                <RefreshCw />
              </Button>
            </div>
          )}

          {/* حماية الخصوصية */}
          <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase font-bold tracking-tighter">
            <ShieldCheck size={12} className="text-emerald-500" />
            تتم معالجة الصورة
          </div>
        </div>

        {/* التنبيهات الخطأ */}
        {error && (
          <div className="mt-8 p-4 bg-red-50 border-r-4 border-red-500 rounded-xl flex items-center gap-3 text-red-700 animate-in slide-in-from-top-2">
            <AlertCircle size={20} />
            <span className="text-sm font-bold">{error}</span>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <style jsx global>{`
        @keyframes scan-slow {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(200%); opacity: 0; }
        }
        .animate-scan-slow {
          animation: scan-slow 3s ease-in-out infinite;
        }
      `}</style>
    </DashboardLayout>
  )
}