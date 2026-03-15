"use client"
import { useState, useEffect, useRef } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  QrCode, Scan, Download, Camera, AlertCircle, 
  StopCircle, Link as LinkIcon, Sparkles, CheckCircle2 
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function QrToolPage() {
  const [text, setText] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scanResult, setScanResult] = useState<string | null>(null)
  
  // استخدام ref لتخزين الكائن الخاص بالماسح لتجنب إعادة التصيير
  const scannerRef = useRef<any>(null)

  // 1. وظيفة تشغيل الكاميرا وإظهار رسالة السماح فوراً
  const startScan = async () => {
    setError(null)
    setScanResult(null)

    try {
      // هذه الخطوة تضمن ظهور رسالة "السماح للكاميرا" في المتصفح فوراً
      await navigator.mediaDevices.getUserMedia({ video: true })
      
      // تحميل المكتبة ديناميكياً لتجنب خطأ client-side exception
      const { Html5Qrcode } = await import("html5-qrcode")
      
      setIsScanning(true)

      // انتظر قليلاً لضمان وجود العنصر في الـ DOM
      setTimeout(() => {
        const html5QrCode = new Html5Qrcode("reader")
        scannerRef.current = html5QrCode

        html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            setScanResult(decodedText)
            if (decodedText.startsWith("http")) {
              window.open(decodedText, "_blank")
            }
            stopCamera()
          },
          () => {} // كشف صامت
        ).catch((err) => {
          setError("فشل تشغيل الماسح: " + err)
          setIsScanning(false)
        })
      }, 500)

    } catch (err: any) {
      setError("يرجى الضغط على 'سماح' في المتصفح لتشغيل الكاميرا.")
    }
  }

  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop()
        scannerRef.current = null
      } catch (e) {
        console.error(e)
      }
    }
    setIsScanning(false)
  }

  const downloadQR = () => {
    if (!text) return
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(text)}`
    const a = document.createElement("a")
    a.href = qrImageUrl
    a.download = "mofed-qr.png"
    a.click()
  }

  // التأكد من إيقاف الكاميرا عند الخروج من الصفحة
  useEffect(() => {
    return () => { stopCamera() }
  }, [])

  return (
    <DashboardLayout title="أدوات الـ QR" description="توليد وقراءة ذكية بتصميم عصري">
      <div className="max-w-xl mx-auto px-4 pb-20 pt-4">
        
        <Tabs defaultValue="generate" dir="rtl" onValueChange={() => stopCamera()}>
          <TabsList className="grid w-full grid-cols-2 h-16 rounded-3xl bg-slate-100 p-2 mb-8">
            <TabsTrigger value="generate" className="rounded-2xl font-bold text-md data-[state=active]:bg-white data-[state=active]:shadow-sm">توليد كود</TabsTrigger>
            <TabsTrigger value="scan" className="rounded-2xl font-bold text-md data-[state=active]:bg-white data-[state=active]:shadow-sm">ماسح ضوئي</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div className="bg-white border-2 border-slate-50 p-8 rounded-[3rem] shadow-xl text-center">
              <div className="relative mb-6">
                <Input 
                  placeholder="ضع الرابط هنا..." 
                  value={text} 
                  onChange={(e) => setText(e.target.value)}
                  className="h-16 pr-12 text-center text-lg font-bold border-2 rounded-2xl focus:border-blue-500 transition-all"
                />
                <LinkIcon className="absolute right-4 top-5 text-slate-300" />
              </div>

              {text ? (
                <div className="flex flex-col items-center gap-6 animate-in zoom-in duration-300">
                  <div className="p-4 bg-white border-4 border-slate-900 rounded-[2rem] shadow-2xl">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(text)}`} 
                      alt="QR" className="w-40 h-40"
                    />
                  </div>
                  <Button onClick={downloadQR} className="w-full bg-blue-600 hover:bg-blue-700 h-16 rounded-2xl font-black text-lg gap-2 shadow-lg shadow-blue-100">
                    <Download size={20} /> تحميل الصورة
                  </Button>
                </div>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2.5rem] text-slate-400">
                  <Sparkles className="mb-2 opacity-20" size={48} />
                  <p className="text-sm font-medium">بانتظار كتابة الرابط...</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="scan" className="space-y-6">
            <div className="relative w-full aspect-square max-w-[400px] mx-auto rounded-[3rem] overflow-hidden bg-slate-950 border-[6px] border-white shadow-2xl">
              {isScanning ? (
                <div id="reader" className="w-full h-full scale-110"></div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-10 text-center">
                   <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-md">
                      <Scan size={40} className="text-blue-400 animate-pulse" />
                   </div>
                   <h3 className="text-xl font-black">جاهز للمسح</h3>
                   <p className="text-slate-400 text-sm mt-2">اضغط على الزر أدناه وامنح صلاحية الكاميرا</p>
                </div>
              )}

              {scanResult && (
                <div className="absolute inset-0 bg-blue-600/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white text-center animate-in fade-in">
                  <CheckCircle2 size={64} className="mb-4" />
                  <p className="font-bold text-lg mb-4 break-all">{scanResult}</p>
                  <Button onClick={startScan} variant="secondary" className="rounded-xl">مسح مرة أخرى</Button>
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-4 items-center">
              <Button 
                onClick={isScanning ? stopCamera : startScan}
                className={cn(
                  "h-20 w-full max-w-sm rounded-3xl font-black text-xl shadow-2xl transition-all",
                  isScanning ? "bg-red-500 hover:bg-red-600" : "bg-slate-900 hover:bg-black"
                )}
              >
                {isScanning ? <><StopCircle className="ml-2" /> إيقاف</> : <><Camera className="ml-2" /> ابدأ المسح الآن</>}
              </Button>
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-2 border border-red-100">
                  <AlertCircle size={18} />
                  <p className="text-xs font-bold">{error}</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <style jsx global>{`
        #reader video { object-fit: cover !important; }
        #reader__dashboard { display: none !important; }
        #reader { border: none !important; }
      `}</style>
    </DashboardLayout>
  )
}