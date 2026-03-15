"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  QrCode, Scan, Download, Camera, AlertCircle, 
  X, Link as LinkIcon, Sparkles, CheckCircle2, 
  Maximize2, Zap, RefreshCw, ChevronLeft
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function QrToolPage() {
  const [activeTab, setActiveTab] = useState<'generate' | 'scan'>('generate')
  const [text, setText] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scanResult, setScanResult] = useState<string | null>(null)
  
  const scannerRef = useRef<any>(null)

  const stopCamera = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop()
        scannerRef.current = null
      } catch (e) {
        console.error(e)
      }
    }
    setIsScanning(false)
  }, [])

  const startScan = async () => {
    setError(null)
    setScanResult(null)
    try {
      await navigator.mediaDevices.getUserMedia({ video: true })
      const { Html5Qrcode } = await import("html5-qrcode")
      setIsScanning(true)

      setTimeout(() => {
        const html5QrCode = new Html5Qrcode("reader")
        scannerRef.current = html5QrCode
        html5QrCode.start(
          { facingMode: "environment" },
          { fps: 20, qrbox: (width, height) => ({ width: width * 0.7, height: width * 0.7 }) },
          (decodedText) => {
            setScanResult(decodedText)
            stopCamera()
          },
          () => {}
        ).catch(() => {
          setError("تعذر تشغيل الكاميرا")
          setIsScanning(false)
        })
      }, 300)
    } catch (err) {
      setError("يرجى منح صلاحية الكاميرا")
    }
  }

  useEffect(() => {
    return () => { stopCamera() }
  }, [stopCamera])

  return (
    <div className="fixed inset-0 bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans">
      
      {/* 1. كاميرا الخلفية (تظهر فقط عند المسح) */}
      {isScanning && (
        <div className="absolute inset-0 z-0 bg-black">
          <div id="reader" className="w-full h-full object-cover shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
          {/* طبقة HUD فاتحة فوق الكاميرا */}
          <div className="absolute inset-0 pointer-events-none border-[30px] border-white/10 backdrop-blur-[2px]">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white/50 rounded-3xl shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-white shadow-[0_0_15px_#fff] animate-scan-move" />
             </div>
          </div>
        </div>
      )}

      <main className="relative z-10 h-full w-full flex flex-col p-6">
        
        {/* الهيدر العلوي - Glassmorphism فاتح */}
        <div className="flex justify-between items-center bg-white/70 backdrop-blur-xl p-4 rounded-[2rem] border border-white shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <QrCode size={22} />
            </div>
            <h1 className="font-black tracking-tight text-lg uppercase">QR <span className="text-blue-600">Vision</span></h1>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => { stopCamera(); setActiveTab(activeTab === 'generate' ? 'scan' : 'generate'); }}
              className="p-3 bg-slate-100 hover:bg-white rounded-full transition-all border border-slate-200"
            >
              {activeTab === 'generate' ? <Scan size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>
        </div>

        {/* محتوى الصفحة */}
        <div className="flex-1 flex flex-col items-center justify-center py-10">
          
          {/* وضع التوليد (Generate) */}
          {activeTab === 'generate' && (
            <div className="w-full max-w-md animate-in slide-in-from-bottom-10 duration-500">
              <div className="bg-white p-10 rounded-[3.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-white text-center">
                <div className="relative mb-8">
                  <Input 
                    placeholder="أدخل الرابط أو النص هنا" 
                    value={text} 
                    onChange={(e) => setText(e.target.value)}
                    className="h-16 pr-12 text-center text-lg font-bold border-none bg-slate-50 rounded-2xl focus-visible:ring-2 ring-blue-500/20"
                  />
                  <LinkIcon className="absolute right-4 top-5 text-slate-300" size={20} />
                </div>

                {text ? (
                  <div className="flex flex-col items-center gap-8 animate-in zoom-in-90">
                    <div className="p-6 bg-white rounded-[2.5rem] shadow-inner-xl border border-slate-100 flex items-center justify-center">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`} 
                        alt="QR" className="w-44 h-44 mix-blend-multiply"
                      />
                    </div>
                    <Button onClick={() => {}} className="w-full h-16 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-blue-600 transition-colors gap-3">
                      <Download size={20} /> تصدير الكود
                    </Button>
                  </div>
                ) : (
                  <div className="h-48 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-300">
                    <Sparkles size={40} className="mb-3 opacity-30" />
                    <p className="text-sm font-medium">أدخل بيانات لتوليد الكود</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* وضع النتيجة بعد المسح */}
          {scanResult && !isScanning && (
            <div className="w-full max-w-sm bg-white p-8 rounded-[3rem] shadow-2xl text-center border border-white animate-in zoom-in-95">
               <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} className="text-emerald-500" />
               </div>
               <h2 className="text-xl font-black mb-4 uppercase tracking-tighter text-slate-800">تم الكشف بنجاح</h2>
               <div className="p-4 bg-slate-50 rounded-2xl mb-8 break-all font-mono text-sm text-blue-600 border border-slate-100">
                 {scanResult}
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <Button onClick={startScan} variant="outline" className="rounded-2xl h-14 border-slate-200">إعادة</Button>
                  <Button className="rounded-2xl h-14 bg-blue-600">نسخ الرابط</Button>
               </div>
            </div>
          )}
        </div>

        {/* الجزء السفلي: التحكم العائم */}
        <div className="pb-10 flex flex-col items-center gap-6">
          {activeTab === 'scan' && !scanResult && (
            <div className="flex flex-col items-center gap-6 pointer-events-auto">
                <button 
                  onClick={isScanning ? stopCamera : startScan}
                  className={cn(
                    "w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-2xl",
                    isScanning ? "bg-white text-red-500 scale-90" : "bg-blue-600 text-white hover:scale-105 shadow-blue-500/30"
                  )}
                >
                  {isScanning ? <X size={32} /> : <Maximize2 size={32} />}
                </button>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  {isScanning ? "Tap to Terminate" : "Activate Full Scan"}
                </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 px-6 py-3 rounded-full flex items-center gap-2 border border-red-100 text-xs font-bold shadow-sm animate-in slide-in-from-bottom-5">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <div className="flex items-center gap-2 text-[10px] text-slate-300 font-bold uppercase tracking-widest">
            <Zap size={12} fill="currentColor" /> Ultra Fast Processing
          </div>
        </div>
      </main>

      <style jsx global>{`
        #reader video { object-fit: cover !important; width: 100% !important; height: 100% !important; }
        #reader__dashboard { display: none !important; }
        #reader { border: none !important; background: black !important; }
        @keyframes scan-move {
          0% { top: 0%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan-move {
          animation: scan-move 2.5s linear infinite;
        }
      `}</style>
    </div>
  )
}