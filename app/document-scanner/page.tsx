"use client"
import { useRef, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Camera, RefreshCw, FileText } from "lucide-react"

export default function DocumentScannerPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isActive, setIsActive] = useState(false)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsActive(true)
      }
    } catch (err) {
      alert("يرجى إعطاء صلاحية الوصول للكاميرا")
    }
  }

  return (
    <DashboardLayout title="ماسح المستندات" description="استخدم الكاميرا لمسح وحفظ المستندات">
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
        <div className="w-full aspect-[4/3] bg-slate-900 rounded-3xl border-8 border-teal-500/10 overflow-hidden relative shadow-2xl">
          {!isActive && (
            <div className="absolute inset-0 flex items-center justify-center text-teal-500/30">
              <Camera size={80} />
            </div>
          )}
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
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