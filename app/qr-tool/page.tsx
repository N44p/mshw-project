"use client"
import { useState, useRef, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { QrCode, Scan, Download, Camera, AlertCircle, StopCircle } from "lucide-react"

export default function QrToolPage() {
  const [text, setText] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // دالة تحميل الكود كصورة
  const downloadQR = () => {
    if (!text) return
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(text)}`
    fetch(qrImageUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'mofed-qr.png'
        document.body.appendChild(a)
        a.click()
        a.remove()
      })
  }

  // دالة إيقاف الكاميرا (لمنع بقاء الشاشة كاملة أو استهلاك البطارية)
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
  }

  // دالة فتح الكاميرا (مع منع الشاشة الكاملة)
  const startScan = async () => {
    setError(null)
    setIsScanning(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" }, // الكاميرا الخلفية
        audio: false 
      })
      
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        // إجبار الفيديو على العمل داخل الإطار (Crucial for iOS/Android)
        videoRef.current.setAttribute("playsinline", "true");
        videoRef.current.setAttribute("webkit-playsinline", "true");
        videoRef.current.play();
      }
    } catch (err: any) {
      setError("يرجى تفعيل صلاحية الكاميرا للمسح")
      setIsScanning(false)
    }
  }

  useEffect(() => {
    return () => stopCamera()
  }, [])

  return (
    <DashboardLayout title="أدوات الـ QR" description="توليد وقراءة الرموز داخل إطار محدد">
      <div className="max-w-xl mx-auto px-4 pb-10">
        <Tabs defaultValue="generate" dir="rtl" onValueChange={(v) => { if(v !== 'scan') stopCamera() }}>
          <TabsList className="grid w-full grid-cols-2 h-14 rounded-2xl bg-slate-100 p-1 mb-6">
            <TabsTrigger value="generate" className="rounded-xl font-black data-[state=active]:bg-white data-[state=active]:shadow-sm">توليد كود</TabsTrigger>
            <TabsTrigger value="scan" className="rounded-xl font-black data-[state=active]:bg-white data-[state=active]:shadow-sm">قراءة كود</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div className="bg-white border-2 border-slate-100 p-6 rounded-[2.5rem] shadow-sm text-center">
              <Input 
                placeholder="ضع الرابط أو النص هنا..." 
                value={text} 
                onChange={(e) => setText(e.target.value)}
                className="h-14 text-center text-lg font-bold border-2 rounded-2xl mb-6 focus:ring-black"
              />
              {text && (
                <div className="flex flex-col items-center gap-6 animate-in zoom-in-95">
                  <div className="p-4 bg-white border-2 border-slate-900 rounded-3xl shadow-inner">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(text)}`} 
                      alt="QR Code"
                      className="w-44 h-44"
                    />
                  </div>
                  <Button onClick={downloadQR} className="w-full bg-slate-900 hover:bg-black h-14 rounded-2xl font-black text-lg gap-2">
                    <Download size={20} /> تحميل PNG
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="scan" className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-2xl flex items-center gap-2 border border-red-100">
                <AlertCircle size={18} />
                <p className="text-sm font-bold">{error}</p>
              </div>
            )}
            
            {/* الحاوية المقيدة - تمنع الكاميرا من تغطية الموقع */}
            <div className="relative w-full aspect-square max-w-[320px] mx-auto rounded-[3rem] overflow-hidden border-8 border-slate-100 bg-slate-900 shadow-2xl">
              {isScanning ? (
                <>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover" 
                  />
                  {/* خط الليزر المتحرك */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-red-500 shadow-[0_0_15px_red] animate-scan-move"></div>
                  <div className="absolute inset-10 border-2 border-white/20 rounded-3xl pointer-events-none border-dashed"></div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20 px-10 text-center">
                  <Scan size={64} className="mb-4" />
                  <p className="text-sm font-bold">اضغط أدناه لفتح الكاميرا في هذا الإطار</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-center pt-4">
              <Button 
                onClick={isScanning ? stopCamera : startScan}
                className={`h-16 px-10 rounded-2xl font-black text-lg gap-3 shadow-lg transition-all ${isScanning ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-900'}`}
              >
                {isScanning ? <><StopCircle /> إيقاف الكاميرا</> : <><Camera /> تشغيل الماسح</>}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* ستايل إضافي لحركة الليزر */}
      <style jsx global>{`
        @keyframes scan-move {
          0% { top: 0% }
          100% { top: 100% }
        }
        .animate-scan-move {
          animation: scan-move 2s linear infinite;
        }
      `}</style>
    </DashboardLayout>
  )
}