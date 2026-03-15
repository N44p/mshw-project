"use client"
import { useState, useEffect, useRef } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { QrCode, Scan, Download, Camera, AlertCircle, StopCircle, Maximize } from "lucide-react"
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode"

export default function QrToolPage() {
  const [text, setText] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // --- 1. وظيفة ملء الشاشة ---
  const toggleFullScreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(err => {
          alert(`خطأ في تفعيل ملء الشاشة: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  }

  // --- 2. وظيفة المسح وفتح الروابط ---
  const startScan = () => {
    setError(null)
    setIsScanning(true)
    
    // تأخير بسيط للتأكد من ظهور الـ Div الخاص بالماسح
    setTimeout(() => {
      const html5QrCode = new Html5Qrcode("reader");
      scannerRef.current = html5QrCode;

      html5QrCode.start(
        { facingMode: "environment" }, 
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          // إذا كان النص الممسوح رابطاً، افتحه فوراً
          if (decodedText.startsWith("http")) {
            window.location.href = decodedText; 
          } else {
            alert("محتوى الكود: " + decodedText);
          }
          stopCamera();
        },
        (errorMessage) => { /* البحث مستمر */ }
      ).catch(err => {
        setError("فشل تشغيل الكاميرا: " + err);
        setIsScanning(false);
      });
    }, 300);
  }

  const stopCamera = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().then(() => {
        scannerRef.current = null;
        setIsScanning(false);
      }).catch(() => setIsScanning(false));
    } else {
      setIsScanning(false);
    }
  }

  // دالة تحميل الـ QR
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

  useEffect(() => {
    return () => { if (isScanning) stopCamera() }
  }, [isScanning])

  return (
    <DashboardLayout title="أدوات الـ QR" description="توليد وقراءة الرموز مع دعم ملء الشاشة">
      <div className="max-w-xl mx-auto px-4 pb-10">
        <Tabs defaultValue="generate" dir="rtl" onValueChange={(v) => { if(v !== 'scan') stopCamera() }}>
          <TabsList className="grid w-full grid-cols-2 h-14 rounded-2xl bg-slate-100 p-1 mb-6">
            <TabsTrigger value="generate" className="rounded-xl font-black">توليد كود</TabsTrigger>
            <TabsTrigger value="scan" className="rounded-xl font-black">قراءة كود</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div className="bg-white border-2 border-slate-100 p-6 rounded-[2.5rem] shadow-sm text-center">
              <Input 
                placeholder="ضع الرابط هنا لفتحه لاحقاً..." 
                value={text} 
                onChange={(e) => setText(e.target.value)}
                className="h-14 text-center text-lg font-bold border-2 rounded-2xl mb-6"
              />
              {text && (
                <div className="flex flex-col items-center gap-6">
                  <div className="p-4 bg-white border-2 border-slate-900 rounded-3xl">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(text)}`} 
                      alt="QR Code"
                      className="w-44 h-44"
                    />
                  </div>
                  <Button onClick={downloadQR} className="w-full bg-slate-900 h-14 rounded-2xl font-black text-lg gap-2">
                    <Download size={20} /> تحميل الصورة
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="scan" className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-2xl flex items-center gap-2">
                <AlertCircle size={18} />
                <p className="text-sm font-bold">{error}</p>
              </div>
            )}
            
            <div ref={containerRef} className="relative w-full aspect-square max-w-[400px] mx-auto rounded-[2rem] overflow-hidden border-4 border-slate-200 bg-black shadow-2xl">
              {isScanning ? (
                <div id="reader" className="w-full h-full"></div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40 p-10 text-center">
                  <Scan size={64} className="mb-4" />
                  <p className="font-bold">جاهز للمسح الضوئي</p>
                </div>
              )}
              
              {/* زر ملء الشاشة يظهر فقط عند تفعيل الكاميرا */}
              {isScanning && (
                <button 
                  onClick={toggleFullScreen}
                  className="absolute bottom-4 right-4 z-50 p-3 bg-white/20 backdrop-blur-md rounded-full text-white"
                >
                  <Maximize size={24} />
                </button>
              )}
            </div>
            
            <div className="flex flex-col gap-3 items-center pt-4">
              <Button 
                onClick={isScanning ? stopCamera : startScan}
                className={`h-16 w-full max-w-[280px] rounded-2xl font-black text-lg gap-3 ${isScanning ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-600'}`}
              >
                {isScanning ? <><StopCircle /> إيقاف</> : <><Camera /> ابدأ المسح الآن</>}
              </Button>
              <p className="text-xs text-slate-400 font-bold">سيتم فتح الروابط تلقائياً عند التعرف عليها</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <style jsx global>{`
        #reader video {
          object-fit: cover !important;
          width: 100% !important;
          height: 100% !important;
        }
        #reader__dashboard { display: none !important; } /* إخفاء أزرار المكتبة الافتراضية */
        #reader { border: none !important; }
      `}</style>
    </DashboardLayout>
  )
}