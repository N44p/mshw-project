"use client"
import { useState, useEffect, useRef } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  QrCode, Scan, Download, Camera, AlertCircle, 
  StopCircle, Maximize, Link as LinkIcon, Sparkles, CheckCircle2 
} from "lucide-react"
import { Html5Qrcode } from "html5-qrcode"
import { cn } from "@/lib/utils"

export default function QrToolPage() {
  const [text, setText] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scanResult, setScanResult] = useState<string | null>(null)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const stopCamera = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
        setIsScanning(false);
      } catch (err) {
        console.error("Error stopping camera", err);
        setIsScanning(false);
      }
    }
  };

  const startScan = async () => {
    setError(null);
    setScanResult(null);
    setIsScanning(true);

    setTimeout(() => {
      const html5QrCode = new Html5Qrcode("reader");
      scannerRef.current = html5QrCode;

      html5QrCode.start(
        { facingMode: "environment" }, 
        { fps: 15, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          setScanResult(decodedText);
          if (decodedText.startsWith("http")) {
            setTimeout(() => window.open(decodedText, "_blank"), 1000);
          }
          stopCamera();
        },
        () => { /* كشف مستمر */ }
      ).catch(err => {
        setError("لم نتمكن من الوصول للكاميرا. تأكد من إعطاء الصلاحية.");
        setIsScanning(false);
      });
    }, 300);
  };

  const downloadQR = () => {
    if (!text) return;
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(text)}&bgcolor=ffffff&color=000000&qzone=2`;
    const link = document.createElement("a");
    link.href = qrImageUrl;
    link.download = "Modern-QR.png";
    link.click();
  };

  useEffect(() => {
    return () => { stopCamera(); };
  }, []);

  return (
    <DashboardLayout title="مركز الـ QR الذكي" description="توليد ومسح الأكواد بأحدث التقنيات البصرية">
      <div className="max-w-2xl mx-auto px-4 pb-20">
        
        <Tabs defaultValue="generate" dir="rtl" className="w-full" onValueChange={() => stopCamera()}>
          <TabsList className="grid w-full grid-cols-2 h-16 rounded-[2rem] bg-slate-200/50 p-2 backdrop-blur-md mb-8">
            <TabsTrigger value="generate" className="rounded-[1.5rem] font-bold text-lg data-[state=active]:bg-white data-[state=active]:shadow-lg">
              <QrCode className="ml-2 w-5 h-5" /> توليد كود
            </TabsTrigger>
            <TabsTrigger value="scan" className="rounded-[1.5rem] font-bold text-lg data-[state=active]:bg-white data-[state=active]:shadow-lg">
              <Scan className="ml-2 w-5 h-5" /> ماسح ضوئي
            </TabsTrigger>
          </TabsList>

          {/* محتوى التوليد */}
          <TabsContent value="generate" className="animate-in fade-in slide-in-from-bottom-4">
            <div className="relative group bg-white border border-slate-200 rounded-[3rem] p-8 shadow-2xl shadow-indigo-100 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] rounded-full -mr-10 -mt-10" />
              
              <div className="space-y-6 relative z-10">
                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-black text-slate-800">صانع الأكواد السريع</h3>
                  <p className="text-slate-500 text-sm italic">أدخل الرابط أو النص لتحويله فوراً</p>
                </div>

                <div className="relative">
                  <Input 
                    placeholder="https://example.com" 
                    value={text} 
                    onChange={(e) => setText(e.target.value)}
                    className="h-16 pr-12 text-center text-xl font-bold rounded-2xl border-2 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-inner"
                  />
                  <LinkIcon className="absolute right-4 top-5 text-slate-400" />
                </div>

                {text ? (
                  <div className="flex flex-col items-center gap-8 py-4 animate-in zoom-in-95 duration-300">
                    <div className="relative group p-6 bg-gradient-to-br from-indigo-50 to-white rounded-[2.5rem] border-2 border-slate-100 shadow-xl">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}&margin=10`} 
                        alt="Generated QR"
                        className="w-48 h-48 rounded-lg"
                      />
                      <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]" />
                    </div>

                    <Button onClick={downloadQR} className="w-full h-16 bg-slate-900 hover:bg-black text-white rounded-2xl text-lg font-black shadow-xl gap-3 transition-transform active:scale-95">
                      <Download size={22} /> حفظ في الاستوديو
                    </Button>
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-[2.5rem] text-slate-300">
                    <Sparkles className="animate-pulse" size={40} />
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* محتوى المسح */}
          <TabsContent value="scan" className="animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-6 text-center">
              
              <div ref={containerRef} className="relative aspect-square max-w-[420px] mx-auto rounded-[3rem] overflow-hidden bg-slate-950 border-[8px] border-white shadow-2xl">
                {!isScanning && !scanResult && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 space-y-4">
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20">
                       <Scan size={40} className="text-indigo-400" />
                    </div>
                    <p className="font-black text-lg">جاهز للمسح الضوئي</p>
                  </div>
                )}

                <div id="reader" className={cn("w-full h-full", !isScanning && "hidden")}></div>

                {scanResult && (
                  <div className="absolute inset-0 bg-indigo-600 flex flex-col items-center justify-center p-8 text-white animate-in zoom-in">
                    <CheckCircle2 size={60} className="mb-4 animate-bounce" />
                    <h4 className="text-xl font-black mb-2">تم التعرف على الكود!</h4>
                    <p className="text-indigo-100 break-all bg-black/20 p-4 rounded-xl text-sm">{scanResult}</p>
                    <Button variant="secondary" onClick={startScan} className="mt-6 rounded-full px-8">مسح كود آخر</Button>
                  </div>
                )}

                {/* طبقة تحديد الزوايا */}
                {isScanning && (
                  <div className="absolute inset-0 pointer-events-none z-10">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-indigo-400 rounded-3xl">
                       <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-400 -mt-1 -ml-1 rounded-tl-xl" />
                       <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-400 -mt-1 -mr-1 rounded-tr-xl" />
                       <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-400 -mb-1 -ml-1 rounded-bl-xl" />
                       <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-400 -mb-1 -mr-1 rounded-br-xl" />
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full bg-black/30 backdrop-blur-[1px]" />
                  </div>
                )}
              </div>

              <div className="pt-4 space-y-4">
                <Button 
                  onClick={isScanning ? stopCamera : startScan}
                  className={cn(
                    "h-20 w-full max-w-sm rounded-[2rem] font-black text-xl shadow-2xl transition-all active:scale-95",
                    isScanning ? "bg-red-500 hover:bg-red-600 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  )}
                >
                  {isScanning ? <><StopCircle className="ml-2" /> إيقاف الكاميرا</> : <><Camera className="ml-2" /> ابدأ القراءة الآن</>}
                </Button>
                
                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 flex items-center justify-center gap-2 font-bold animate-shake">
                    <AlertCircle size={18} /> {error}
                  </div>
                )}
              </div>
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
        #reader__dashboard { display: none !important; }
        #reader { border: none !important; padding: 0 !important; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out infinite; }
      `}</style>
    </DashboardLayout>
  )
}