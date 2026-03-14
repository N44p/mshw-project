"use client"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Navigation, Clock, ListOrdered, Calendar } from "lucide-react"

export default function PrayerTimesPage() {
  const [times, setTimes] = useState<any>(null)
  const [cityName, setCityName] = useState("جاري التحديد...")
  const [nextPrayer, setNextPrayer] = useState({ name: "...", time: "--:--" })

  const format12Hour = (time24: string) => {
    if (!time24 || time24 === "--:--") return time24
    let [h, m] = time24.split(':')
    let hour = parseInt(h)
    const ampm = hour >= 12 ? 'م' : 'ص'
    hour = hour % 12 || 12
    return `${hour}:${m} ${ampm}`
  }

  useEffect(() => {
    const fetchData = async (lat: number, lon: number) => {
      try {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=ar`)
        const geoData = await geoRes.json()
        setCityName(geoData.address.city || geoData.address.town || "موقعك الحالي")

        const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=4`)
        const data = await res.json()
        const t = data.data.timings
        setTimes(t)
        
        const now = new Date()
        const list = [
          { n: "الفجر", t: t.Fajr }, { n: "الظهر", t: t.Dhuhr },
          { n: "العصر", t: t.Asr }, { n: "المغرب", t: t.Maghrib }, { n: "العشاء", t: t.Isha }
        ]
        const upcoming = list.find(p => {
          const [h, m] = p.t.split(':')
          const pDate = new Date()
          pDate.setHours(parseInt(h), parseInt(m), 0)
          return pDate > now
        }) || list[0]
        setNextPrayer({ name: upcoming.n, time: upcoming.t })
      } catch (err) {
        setCityName("تعذر جلب البيانات")
      }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => fetchData(pos.coords.latitude, pos.coords.longitude))
    }
  }, [])

  const prayerLabels = [
    { id: "Fajr", n: "الفجر" },
    { id: "Dhuhr", n: "الظهر" },
    { id: "Asr", n: "العصر" },
    { id: "Maghrib", n: "المغرب" },
    { id: "Isha", n: "العشاء" }
  ]

  return (
    <DashboardLayout title="مواقيت الصلاة" description="مواقيت الصلاة حسب موقعك بدقة">
      <div className="max-w-5xl mx-auto space-y-8 pb-16 px-4">
        
        {/* 1. جدول علوي - تصميم Modern Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {times && prayerLabels.map((p) => {
            const isNext = p.n === nextPrayer.name;
            return (
              <div key={p.id} className={`p-6 rounded-[2rem] border-2 transition-all duration-500 flex flex-col items-center gap-1 ${
                isNext 
                ? 'bg-slate-900 border-indigo-500 shadow-xl scale-105 z-10' 
                : 'bg-white border-slate-100 hover:border-indigo-100'
              }`}>
                <span className={`text-[10px] font-black uppercase tracking-widest ${isNext ? 'text-indigo-400' : 'text-slate-400'}`}>
                  {p.n}
                </span>
                <span className={`text-2xl font-black ${isNext ? 'text-white' : 'text-slate-900'}`}>
                  {format12Hour(times[p.id]).split(' ')[0]}
                </span>
                <span className={`text-[10px] font-bold ${isNext ? 'text-indigo-300/60' : 'text-slate-300'}`}>
                   {format12Hour(times[p.id]).split(' ')[1]}
                </span>
              </div>
            )
          })}
        </div>

        {/* 2. الصلاة القادمة - خلفية خطوط هندسية (Geometrical Lines) */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-900 to-black rounded-[3.5rem] p-12 md:p-20 shadow-2xl border border-white/5">
          {/* نمط الخطوط الهندسية بدلاً من النجوم */}
          <div className="absolute inset-0 opacity-[0.07]" 
               style={{ backgroundImage: `linear-gradient(30deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff), linear-gradient(150deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff), linear-gradient(30deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff), linear-gradient(150deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff), linear-gradient(60deg, #ffffff 25%, transparent 25.5%, transparent 75%, #ffffff 75.5%, #ffffff), linear-gradient(60deg, #ffffff 25%, transparent 25.5%, transparent 75%, #ffffff 75.5%, #ffffff)`, backgroundSize: '40px 70px' }}>
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="space-y-6 text-center md:text-right">
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
                <Navigation size={14} className="text-indigo-400" />
                <span className="text-xs font-bold text-indigo-100 tracking-wider uppercase">{cityName}</span>
              </div>
              <div>
                <h4 className="text-indigo-400/80 text-xs font-black uppercase tracking-[0.1em] mb-2">الوقت المتبقي للصلاة القادمة</h4>
                <h2 className="text-7xl md:text-[10rem] font-black text-white leading-none tracking-tighter">
                  {nextPrayer.name}
                </h2>
              </div>
            </div>

            <div className="relative group">
               <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 rounded-full group-hover:opacity-40 transition-opacity"></div>
               <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 w-56 h-56 md:w-72 md:h-72 rounded-full flex flex-col items-center justify-center shadow-inner">
                  <Clock className="text-indigo-400 mb-2 animate-pulse" size={40} />
                  <span className="text-6xl md:text-8xl font-black text-white font-mono leading-none">
                    {format12Hour(nextPrayer.time).split(' ')[0]}
                  </span>
                  <span className="text-xl font-bold text-indigo-400 tracking-widest mt-2 uppercase">
                    {format12Hour(nextPrayer.time).split(' ')[1]}
                  </span>
               </div>
            </div>
          </div>
        </div>

        {/* 3. القائمة السفلية التفصيلية */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
           <div className="flex items-center gap-3 mb-8 px-2">
              <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                <ListOrdered size={20} />
              </div>
              <h3 className="font-black text-slate-800 text-lg">جدول المواقيت الكاملة</h3>
           </div>
           
           
<div className="space-y-4">
  {times && prayerLabels.map((p) => (
    <div key={p.id} className="group flex justify-between items-center p-5 rounded-2xl border border-transparent hover:border-slate-600 hover:bg-slate-50/50 transition-all">
      <div className="flex items-center gap-4">
        <div className={`w-2 h-2 rounded-full transition-colors ${p.n === nextPrayer.name ? 'bg-indigo-500 animate-pulse' : 'bg-slate-200 group-hover:bg-indigo-300'}`}></div>
        <span className="text-slate-700 font-bold text-lg">{p.n}</span>
      </div>
      <div className="flex items-center gap-8">
        {/* هنا التصحيح: نصل للوقت من كائن times باستخدام المعرف p.id */}
        <span className="text-slate-400 font-mono text-sm hidden md:block">
          توقيت {times[p.id]}
        </span>
        <span className="text-slate-900 font-black text-2xl">
          {format12Hour(times[p.id])}
        </span>
      </div>
    </div>
  ))}
</div>
        </div>

      </div>
    </DashboardLayout>
  )
}