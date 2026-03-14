"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Briefcase, Calculator, Info, Coins, X, Globe2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// قاعدة بيانات الدول العربية المحدثة
const countryLaws: Record<string, any> = {
  saudi: { name: "السعودية 🇸🇦", first5: 15, after5: 30, hasResignationScale: true },
  uae: { name: "الإمارات 🇦🇪", first5: 21, after5: 30, hasResignationScale: true },
  qatar: { name: "قطر 🇶🇦", first5: 21, after5: 30, hasResignationScale: false },
  bahrain: { name: "البحرين 🇧🇭", first5: 15, after5: 30, hasResignationScale: true },
  oman: { name: "عمان 🇴🇲", first5: 15, after5: 30, hasResignationScale: false },
  kuwait: { name: "الكويت 🇰🇼", first5: 15, after5: 30, limitMonths: 18, hasResignationScale: true },
  jordan: { name: "الأردن 🇯🇴", first5: 30, after5: 30, hasResignationScale: false },
  iraq: { name: "العراق 🇮🇶", first5: 30, after5: 30, hasResignationScale: false },
  syria: { name: "سوريا 🇸🇾", first5: 30, after5: 30, hasResignationScale: false },
  egypt: { name: "مصر 🇪🇬", first5: 15, after5: 30, hasResignationScale: false },
  lebanon: { name: "لبنان 🇱🇧", first5: 30, after5: 30, hasResignationScale: false },
  morocco: { name: "المغرب 🇲🇦", first5: 30, after5: 30, hasResignationScale: false },
}

export default function EndOfServicePage() {
  const [salary, setSalary] = useState("")
  const [years, setYears] = useState("")
  const [country, setCountry] = useState("saudi")
  const [sector, setSector] = useState("private")
  const [reason, setReason] = useState("termination")
  const [showInfo, setShowInfo] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const calculateEOS = () => {
    const s = parseFloat(salary) || 0
    const y = parseFloat(years) || 0
    let total = 0
    const law = countryLaws[country];

    // نظام الحساب (يختلف من دولة لأخرى حسب المدخلات أعلاه)
    if (sector === "public") {
      total = y * s;
    } else {
      // حساب المكافأة بناءً على شرائح الدولة المختارة
      const firstPeriodRate = law.first5 / 30; // تحويل الأيام لشهور
      const secondPeriodRate = law.after5 / 30;

      if (y <= 5) {
        total = y * (s * firstPeriodRate);
      } else {
        total = (5 * (s * firstPeriodRate)) + ((y - 5) * (s * secondPeriodRate));
      }

      // تطبيق سلم الاستقالة للدول التي تعتمده (مثل السعودية والإمارات والكويت)
      if (reason === "resignation" && law.hasResignationScale) {
        if (y < 2) total = 0;
        else if (y < 5) total *= (1/3);
        else if (y < 10) total *= (2/3);
      }
    }

    if (country === "kuwait" && sector === "private" && total > (s * 18)) total = s * 18;

    return Math.round(total).toLocaleString('en-US');
  }

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F1F5F9] p-4 md:p-12 font-sans" dir="rtl">
      
      {/* نافذة المعلومات */}
      <AnimatePresence>
        {showInfo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] w-full max-w-sm overflow-hidden shadow-2xl border border-slate-200"
            >
              <div className="p-8 space-y-5 text-right">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <h3 className="font-black text-xl text-slate-900 flex items-center gap-2">
                    <Info className="w-6 h-6 text-indigo-600" /> الأجر الفعلي
                  </h3>
                  <button onClick={() => setShowInfo(false)} className="bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4 text-slate-600 font-bold text-sm leading-relaxed">
                  <p className="text-slate-900">للحصول على نتيجة دقيقة، أدخل الراتب الذي يشمل:</p>
                  <ul className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-100 text-slate-800">
                    <li className="flex items-center gap-2">• الراتب الأساسي</li>
                    <li className="flex items-center gap-2">• بدل السكن (نقدي/عيني)</li>
                    <li className="flex items-center gap-2">• بدل المواصلات</li>
                    <li className="flex items-center gap-2">• البدلات الثابتة الأخرى</li>
                  </ul>
                </div>
                <button onClick={() => setShowInfo(false)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-indigo-200 transition-all">
                  تم، فهمت ذلك
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-xl mx-auto space-y-8">
        <header className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 text-slate-500 text-xs font-bold mb-2">
            <Globe2 className="w-3 h-3 text-indigo-500" /> تغطية شاملة لـ 12 دولة عربية
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-700 tracking-tight leading-tight">
            حاسبة نهاية الخدمة
          </h1>
          <p className="text-slate-500 font-bold text-sm">للقطاع العام والخاص</p>
        </header>

        <Card className="border-none bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[3rem] overflow-hidden">
          <CardContent className="p-8 md:p-12 space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-slate-700 text-[14px] font-black mr-2">دولة العمل</label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="h-14 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-700 font-black focus:ring-2 focus:ring-indigo-500/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 rounded-2xl max-h-72">
                    {Object.entries(countryLaws).map(([key, value]) => (
                      <SelectItem key={key} value={key} className="font-bold py-3">{value.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-slate-900 text-[14px] font-black mr-2">نوع القطاع</label>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-2">
                  <button onClick={() => setSector("private")} className={`flex-1 py-3 rounded-xl font-black text-xs transition-all ${sector === 'private' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>خاص</button>
                  <button onClick={() => setSector("public")} className={`flex-1 py-3 rounded-xl font-black text-xs transition-all ${sector === 'public' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>حكومي</button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3 text-right">
                <div className="flex items-center justify-between mr-2">
                  <label className="text-slate-900 text-[14px] font-black tracking-tight">الأجر الشهري الأخير (الفعلي)</label>
                  <button onClick={() => setShowInfo(true)} className="flex items-center gap-1.5 text-[11px] font-black text-indigo-600 bg-indigo-50 px-3 py-2 rounded-xl border border-indigo-100">
                    <Info className="w-3.5 h-3.5" /> ماذا يشمل؟
                  </button>
                </div>
                <div className="relative group">
                  <Input type="number" placeholder="0.00" value={salary} onChange={(e)=>setSalary(e.target.value)} 
                    className="h-16 text-3xl font-black border-2 border-slate-100 bg-white rounded-2xl pr-6 text-slate-900 focus:border-indigo-500 transition-all shadow-none" 
                  />
                  <Coins className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors w-6 h-6" />
                </div>
              </div>

              <div className="space-y-3 text-right">
                <label className="text-slate-900 text-[14px] font-black mr-2">عدد سنوات الخدمة</label>
                <div className="relative group">
                  <Input type="number" placeholder="0" value={years} onChange={(e)=>setYears(e.target.value)} 
                    className="h-16 text-3xl font-black border-2 border-slate-100 bg-white rounded-2xl pr-6 text-slate-900 focus:border-indigo-500 transition-all shadow-none" 
                  />
                  <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors w-6 h-6" />
                </div>
              </div>
            </div>

            {sector === "private" && (
              <div className="space-y-4">
                <label className="text-slate-900 text-[14px] font-black text-center block">سبب انتهاء العلاقة</label>
                <div className="flex bg-slate-900 p-2 rounded-[1.5rem] gap-2">
                  <button onClick={() => setReason("termination")} className={`flex-1 py-4 rounded-xl font-black text-xs transition-all ${reason === 'termination' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400'}`}>فصل / انتهاء عقد</button>
                  <button onClick={() => setReason("resignation")} className={`flex-1 py-4 rounded-xl font-black text-xs transition-all ${reason === 'resignation' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400'}`}>استقالة</button>
                </div>
              </div>
            )}
            
            <motion.div layout className="bg-slate-900 p-10 md:p-14 rounded-[3rem] text-white text-center shadow-2xl relative border-b-[10px] border-indigo-600">
              <p className="text-indigo-400 text-[11px] font-black mb-3 uppercase tracking-widest">إجمالي مبلغ المكافأة التقديري</p>
              <AnimatePresence mode="wait">
                <motion.h2 key={calculateEOS()} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} 
                  className="text-5xl md:text-7xl font-black text-white tracking-tighter"
                >
                  {calculateEOS()}
                </motion.h2>
              </AnimatePresence>
              <div className="mt-5 text-[11px] text-slate-500 font-bold border-t border-slate-800 pt-5">
                 صافي مستحقات نهاية الخدمة
              </div>
              <Calculator className="absolute -bottom-6 -left-6 w-24 h-24 text-white/[0.03] -rotate-12" />
            </motion.div>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}