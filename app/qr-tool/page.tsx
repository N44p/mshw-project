"use client"
import { useState, useRef, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { QrCode, Scan, Download, Camera, AlertCircle } from "lucide-react"

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
        a.download = 'mofed-qr-2026.png'
        document.body.appendChild(a)
        a.click()
        a.remove()
      })
  }

  // دالة إيقاف الكاميرا
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
  }

  // دالة فتح الكاميرا للمسح
  const startScan = async () => {
    setError(null)
    setIsScanning(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" },
        audio: false 
      })
      
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        // التأكد من التشغيل بعد تحميل البيانات
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(console.error)
        }
      }
    } catch (err: any) {
      console.error("QR Camera Error:", err)
      setError("يرجى إعطاء صلاحية الكاميرا للمسح من إعدادات المتصفح")
      setIsScanning(false)
    }
  }

  // تنظيف الكاميرا عند مغادرة الصفحة
  useEffect(() => {
    return () => stopCamera()
  }, [])

  return (
    <DashboardLayout title="أدوات الـ QR" description="توليد وقراءة الرموز في مكان واحد">
      <div className="max-w-xl mx-auto px-4">
        <Tabs defaultValue="generate" dir="rtl" onValueChange={(val) => { if(val !== 'scan') stopCamera() }}>
          <TabsList className="grid w-full grid-cols-2 h-16 rounded-2xl bg-gray-100 p-1 mb-8">
            <TabsTrigger value="generate" className="rounded-xl font-black data-[state=active]:bg-black data-[state=active]:text-white">توليد كود</TabsTrigger>
            <TabsTrigger value="scan" className="rounded-xl font-black data-[state=active]:bg-black data-[state=active]:text-white">قراءة كود</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6 animate-in fade-in">
            <div className="bg-white border-4 border-black p-8 rounded-[2.5rem] shadow-xl text-center">
              <Input 
                placeholder="أدخل الرابط هنا..." 
                value={text} 
                onChange={(e) => setText(e.target.value)}
                className="h-16 text-lg font-bold border-2 rounded-2xl mb-6 text-center"
              />
              {text && (
                <div className="flex flex-col items-center gap-6">
                  <div className="p-4 bg-white border-2 border-black rounded-2xl">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(text)}`} 
                      alt="QR"
                      className="w-48 h-48"
                    />
                  </div>
                  <Button 
                    onClick={downloadQR}
                    className="w-full bg-black hover:bg-gray-800 h-14 rounded-2xl font-black text-lg flex gap-2"
                  >
                    <Download size={20} />
                    تحميل بصيغة PNG
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="scan" className="text-center space-y-4 animate-in fade-in">
            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-2xl flex items-center gap-2 mb-4 border border-red-100">
                <AlertCircle size={18} />
                <p className="text-sm font-bold">{error}</p>
              </div>
            )}
            
            <div className="border-4 border-dashed border-gray-300 rounded-[2.5rem] p-4 bg-gray-50 flex flex-col items-center min-h-[350px] justify-center overflow-hidden">
              {isScanning ? (
                <div className="relative w-full aspect-square max-w-[300px]">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full rounded-3xl bg-black object-cover border-4 border-black" 
                  />
                  {/* إطار وهمي للمسح */}
                  <div className="absolute inset-8 border-2 border-teal-500 rounded-2xl opacity-50 animate-pulse pointer-events-none"></div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Scan size={64} className="text-gray-300 mb-4" />
                  <p className="font-bold text-gray-400 text-lg px-8">اضغط على الزر أدناه لتفعيل ماسح الرموز</p>
                </div>
              )}
              
              <Button 
                onClick={isScanning ? stopCamera : startScan}
                className={`mt-6 rounded-xl px-10 h-14 font-black flex gap-2 ${isScanning ? 'bg-red-500 hover:bg-red-600' : 'bg-black'}`}
              >
                <Camera size={20} />
                {isScanning ? "إيقاف الكاميرا" : "فتح الكاميرا الآن"}
              </Button>
            </div>
            <p className="text-xs text-gray-400 font-bold tracking-tight">ملاحظة: تأكد من وجود إضاءة جيدة حول الكود</p>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}