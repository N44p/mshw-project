"use client"
import { useRef, useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Camera, RefreshCw, FileText, AlertCircle } from "lucide-react"

export default function DocumentScannerPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isActive, setIsActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startCamera = async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" }, // الكاميرا الخلفية
        audio: false 
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        // هذه الخاصية تمنع الفيديو من أخذ الشاشة كاملة في الآيفون
        videoRef.current.setAttribute("playsinline", "true");
        videoRef.current.play();
        setIsActive(true);
      }
    } catch (err: any) {
      setError("يرجى تفعيل صلاحية الكاميرا");
    }
  }

  return (
    <DashboardLayout title="ماسح المستندات" description="تصوير المستندات داخل الإطار">
      <div className="max-w-md mx-auto flex flex-col items-center gap-6 px-4">
        
        {/* الحاوية المقيدة - لن تخرج الكاميرا عن هذا المربع */}
        <div className="relative w-full aspect-[3/4] bg-slate-900 rounded-[2.5rem] border-8 border-white shadow-2xl overflow-hidden ring-1 ring-slate-200">
          {!isActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20 gap-3">
              <Camera size={48} />
              <p className="text-xs font-bold">بانتظار تشغيل الكاميرا</p>
            </div>
          )}
          
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            playsInline // أهم خاصية لمنع الـ Full Screen التلقائي
            className="w-full h-full object-cover" 
          />
          
          {/* إطار وهمي يوضح للمستخدم مكان وضع الورقة */}
          {isActive && (
            <div className="absolute inset-6 border-2 border-white/40 rounded-xl border-dashed pointer-events-none flex items-center justify-center">
               <div className="w-full h-[1px] bg-white/10 animate-scan shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
            </div>
          )}
        </div>

        <div className="flex gap-3 w-full">
          {!isActive ? (
            <Button onClick={startCamera} className="flex-1 bg-black h-14 rounded-2xl text-lg font-black gap-2">
              <Camera size={20} /> فتح الكاميرا
            </Button>
          ) : (
            <>
              <Button onClick={() => window.print()} className="flex-1 bg-teal-600 h-14 rounded-2xl text-lg font-black gap-2">
                <FileText size={20} /> حفظ PDF
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()} className="h-14 w-14 rounded-2xl border-2">
                <RefreshCw size={20} />
              </Button>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}