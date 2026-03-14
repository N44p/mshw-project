"use client"
import { useState, useRef } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { QrCode, Scan, Download, Camera } from "lucide-react"

export default function QrToolPage() {
  const [text, setText] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

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
        a.download = 'qr-code-2026.png'
        document.body.appendChild(a)
        a.click()
        a.remove()
      })
  }

  // دالة فتح الكاميرا للمسح
  const startScan = async () => {
    setIsScanning(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      alert("يرجى إعطاء صلاحية الكاميرا للمسح")
      setIsScanning(false)
    }
  }

  return (
    <DashboardLayout title="أدوات الـ QR" description="توليد وقراءة الرموز في مكان واحد">
      <div className="max-w-xl mx-auto">
        <Tabs defaultValue="generate" dir="rtl">
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
                className="h-16 text-lg font-bold border-2 rounded-2xl mb-6"
              />
              {text && (
                <div className="flex flex-col items-center gap-6">
                  <div className="p-4 bg-white border-2 border-black rounded-2xl">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${text}`} 
                      alt="QR"
                      className="w-48 h-48"
                    />
                  </div>
                  <Button 
                    onClick={downloadQR}
                    className="w-full bg-black h-14 rounded-2xl font-black text-lg flex gap-2"
                  >
                    <Download size={20} />
                    تحميل بصيغة PNG
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="scan" className="text-center space-y-4 animate-in fade-in">
            <div className="border-4 border-dashed border-gray-300 rounded-[2.5rem] p-6 bg-gray-50 flex flex-col items-center min-h-[400px] justify-center">
              {isScanning ? (
                <video ref={videoRef} autoPlay playsInline className="w-full rounded-3xl bg-black aspect-square object-cover border-2 border-black" />
              ) : (
                <>
                  <Scan size={64} className="text-gray-300 mb-4" />
                  <p className="font-bold text-gray-500 text-lg">جاري تفعيل الكاميرا للمسح...</p>
                </>
              )}
              <Button 
                onClick={startScan}
                className="mt-6 bg-black rounded-xl px-10 h-14 font-black flex gap-2"
              >
                <Camera size={20} />
                {isScanning ? "إعادة التشغيل" : "فتح الكاميرا الآن"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}