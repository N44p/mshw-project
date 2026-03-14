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
        video: { 
          facingMode: "environment", // محاولة فتح الكاميرا الخلفية
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false // تأكيد عدم طلب الميكروفون لتسهيل الإذن
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        // ننتظر حتى يتم تحميل البيانات الوصفية للفيديو قبل البدء
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play()
          setIsActive(true)
        }
      }
    } catch (err: any) {
      console.error("Camera Error:", err)
      if (err.name === 'NotAllowedError') {
        setError("تم رفض الوصول للكاميرا. يرجى تفعيلها من إعدادات المتصفح.")
      } else {
        setError("تعذر فتح الكاميرا. قد تكون مستخدمة من تطبيق آخر أو غير مدعومة.")
      }
    }
  }

  // تنظيف الكاميرا عند إغلاق الصفحة (مهم جداً للمتصفحات)
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        const tracks = stream.getTracks()
        tracks.forEach(track => track.stop())
      }
    }
  }, [])

  return (
    <DashboardLayout title="ماسح المستندات" description="استخدم الكاميرا لمسح وحفظ المستندات">
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
        
        {error && (
          <div className="w-full p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-2">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="w-full aspect-[4/3] bg-slate-900 rounded-3xl border-8 border-teal-500/10 overflow-hidden relative shadow-2xl">
          {!isActive && (
            <div className="absolute inset-0 flex items-center justify-center text-teal-500/30">
              <Camera size={80} />
            </div>
          )}
          {/* أضفنا muted و playsInline بشكل صريح */}
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover" 
          />
        </div>

        <div className="flex gap-4">
          {!isActive ? (
            <Button onClick={startCamera} className="bg-teal-600 hover:bg-teal-700 py-6 px-10 text-lg rounded-2xl gap-2">
              <Camera className="w-5 h-5" /> فتح الكاميرا
            </Button>
          ) : (
            <>
              <Button onClick={() => window.print()} className="bg-teal-600 hover:bg-teal-700 py-6 px-10 text-lg rounded-2xl gap-2">
                <FileText className="w-5 h-5" /> تصوير وحفظ PDF
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()} className="py-6 px-6 rounded-2xl">
                <RefreshCw className="w-5 h-5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}