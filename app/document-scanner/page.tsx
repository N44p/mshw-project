"use client"
import { useRef, useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Camera, RefreshCw, FileText, AlertCircle, Maximize, StopCircle } from "lucide-react"

export default function DocumentScannerPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const [isActive, setIsActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

  // 1. وظيفة تشغيل الكاميرا
  const startCamera = async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false 
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsActive(true);
      }
    } catch (err: any) {
      setError("يرجى تفعيل صلاحية الكاميرا");
    }
  }

  // 2. وظيفة ملء الشاشة (تفعيل الـ Fullscreen API)
  const toggleFullScreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch((err) => {
          alert(`خطأ في تفعيل ملء الشاشة: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  }

  // 3. وظيفة التقاط الصورة (تجميد المشهد)
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setCapturedImage(canvas.toDataURL("image/png"));
        // إيقاف الكاميرا بعد الالتقاط لتوفير الطاقة
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        setIsActive(false);
      }
    }
  }

  return (
    <DashboardLayout title="ماسح المستندات" description="التقط المستندات بوضوح ملء الشاشة">
      <div className="max-w-md mx-auto flex flex-col items-center gap-6 px-4">
        
        {/* حاوية الكاميرا - هي التي ستصبح ملء الشاشة */}
        <div 
          ref={containerRef}
          className="relative w-full aspect-[3/4] bg-slate-900 rounded-[2.5rem] border-8 border-white shadow-2xl overflow-hidden ring-1 ring-slate-200"
        >
          {!isActive && !capturedImage && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20 gap-3">
              <Camera size={48} />
              <p className="text-xs font-bold">بانتظار تشغيل الكاميرا</p>
            </div>
          )}
          
          {capturedImage ? (
            <img src={capturedImage} className="w-full h-full object-contain bg-black" alt="Captured" />
          ) : (
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              playsInline 
              className="w-full h-full object-cover" 
            />
          )}

          {/* أزرار تحكم داخل الإطار (تظهر عند العمل) */}
          {isActive && (
            <>
              <div className="absolute inset-6 border-2 border-white/40 rounded-xl border-dashed pointer-events-none"></div>
              <button 
                onClick={toggleFullScreen}
                className="absolute top-4 right-4 p-3 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition"
              >
                <Maximize size={20} />
              </button>
            </>
          )}
        </div>

        {/* أزرار الأوامر الأسفل */}
        <div className="flex flex-col gap-3 w-full">
          {!isActive && !capturedImage ? (
            <Button onClick={startCamera} className="h-16 bg-indigo-600 hover:bg-indigo-700 rounded-2xl text-lg font-black gap-2">
              <Camera size={20} /> فتح الكاميرا
            </Button>
          ) : isActive ? (
            <Button onClick={capturePhoto} className="h-16 bg-black hover:bg-slate-800 rounded-2xl text-lg font-black gap-2">
              التقاط المستند الآن
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={() => window.print()} className="flex-1 bg-teal-600 h-16 rounded-2xl text-lg font-black gap-2">
                <FileText size={20} /> حفظ PDF
              </Button>
              <Button variant="outline" onClick={() => { setCapturedImage(null); startCamera(); }} className="h-16 px-6 rounded-2xl border-2">
                <RefreshCw size={20} />
              </Button>
            </div>
          )}
        </div>

        {/* عنصر خفي لمعالجة الصورة */}
        <canvas ref={canvasRef} className="hidden"></canvas>

        {error && (
          <div className="flex items-center gap-2 text-red-500 font-bold text-sm bg-red-50 p-3 rounded-xl">
            <AlertCircle size={16} /> {error}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(100%); }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
        /* تحسين مظهر ملء الشاشة */
        div:fullscreen {
          width: 100vw;
          height: 100vh;
          border: none;
          border-radius: 0;
        }
        div:fullscreen video {
          object-fit: contain;
        }
      `}</style>
    </DashboardLayout>
  )
}