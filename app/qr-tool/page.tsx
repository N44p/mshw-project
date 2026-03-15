"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  QrCode, Scan, Link as LinkIcon, CheckCircle2, 
  Maximize2, X, ChevronLeft, AlertCircle, Zap
} from "lucide-react"


export default function QrToolPage() {
  const [activeTab, setActiveTab] = useState<'generate' | 'scan'>('generate')
  const [text, setText] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scanResult, setScanResult] = useState<string | null>(null)
  
  const scannerRef = useRef<any>(null)

  const stopCamera = useCallback(async () => {
    if (scannerRef.current) {
      try { await scannerRef.current.stop(); scannerRef.current = null } 
      catch (e) { console.error(e) }
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
          { fps: 20, qrbox: (width, height) => ({ width: width * 0.7, height: height * 0.7 }) },
          (decodedText) => { setScanResult(decodedText); stopCamera() },
          () => {}
        ).catch(() => { setError("تعذر تشغيل الكاميرا"); setIsScanning(false) })
      }, 300)
    } catch { setError("يرجى منح صلاحية الكاميرا") }
  }

  useEffect(() => { return () => { stopCamera() } }, [stopCamera])

  return (
    <div className="fixed inset-0 bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans">

      {isScanning && (
        <div className="absolute inset-0 z-0 bg-black">
          <div id="reader" className="w-full h-full object-cover" />
        </div>
      )}

      <main className="relative z-10 h-full w-full flex flex-col p-6">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <QrCode size={22} />
            </div>
            <h1 className="font-bold text-lg">QR <span className="text-blue-600">Vision</span></h1>
          </div>
          <div>
            <button 
              onClick={() => { stopCamera(); setActiveTab(activeTab === 'generate' ? 'scan' : 'generate'); }}
              className="p-2 bg-slate-100 hover:bg-white rounded-full border border-slate-200"
            >
              {activeTab === 'generate' ? <Scan size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center py-10">
          {activeTab === 'generate' && (
            <div className="w-full max-w-md">
              <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-200 text-center">
                
                <Input 
                  placeholder="أدخل الرابط أو النص هنا"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="h-14 text-center text-lg font-medium mb-6 rounded-lg border border-slate-200"
                />

                {text ? (
                  <div className="flex flex-col items-center gap-6">
                    <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`} 
                        alt="QR" className="w-44 h-44"
                      />
                    </div>
                    <Button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: "مسح QR",
                            text: "هذا هو الكود الخاص بي",
                            url: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`
                          }).catch(() => alert("فشل المشاركة"))
                        } else {
                          navigator.clipboard.writeText(text).then(() => alert("تم نسخ الرابط!"))
                        }
                      }}
                      className="w-full h-14 bg-blue-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                    >
                      <LinkIcon size={18} /> مشاركة
                    </Button>
                  </div>
                ) : (
                  <div className="h-40 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400">
                    أدخل بيانات لتوليد الكود
                  </div>
                )}
              </div>
            </div>
          )}

          {scanResult && !isScanning && (
            <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-md border border-slate-200 text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="text-green-600" />
              </div>
              <h2 className="text-lg font-bold mb-2">تم الكشف بنجاح</h2>
              <div className="p-3 bg-slate-50 rounded-lg mb-4 text-sm text-blue-600 break-all border border-slate-200">{scanResult}</div>
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={startScan} variant="outline" className="h-12 rounded-lg border-slate-200">إعادة</Button>
                <Button className="h-12 rounded-lg bg-blue-600 text-white">نسخ الرابط</Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-2 rounded-full flex items-center gap-2 border border-red-100 text-sm shadow-sm">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <div className="mt-auto flex justify-center text-xs text-slate-400 font-bold gap-1">
          <Zap size={12} /> Ultra Fast Processing
        </div>
      </main>

      <style jsx global>{`
        #reader video { object-fit: cover !important; width: 100% !important; height: 100% !important; }
        #reader__dashboard { display: none !important; }
        #reader { border: none !important; background: black !important; }
      `}</style>
    </div>
  )
}