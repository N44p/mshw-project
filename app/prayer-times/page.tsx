"use client"
import { useState, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Navigation, Clock, ListOrdered, MapPin, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PrayerTimesPage() {
  const [times, setTimes] = useState<any>(null)
  const [cityName, setCityName] = useState("الموقع غير محدد")
  const [nextPrayer, setNextPrayer] = useState({ name: "...", time: "--:--" })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const format12Hour = (time24: string) => {
    if (!time24 || time24 === "--:--") return time24
    let [h, m] = time24.split(':')
    let hour = parseInt(h)
    const ampm = hour >= 12 ? 'م' : 'ص'
    hour = hour % 12 || 12
    return `${hour}:${m} ${ampm}`
  }

  const fetchData = useCallback(async (lat: number, lon: number) => {
    try {
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=ar`)
      const geoData = await geoRes.json()
      setCityName(geoData.address.city || geoData.address.town || geoData.address.state || "موقعك الحالي")

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
      setLoading(false)
    } catch (err) {
      setError("حدث خطأ أثناء جلب مواقيت الصلاة")
      setLoading(false)
    }
  }, [])

  const getLocation = () => {
    setLoading(true)
    setError(null)
    
    if (!navigator.geolocation) {
      setError("متصفحك لا يدعم تحديد الموقع")
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchData(pos.coords.latitude, pos.coords.longitude)
      },
      (err) => {
        setLoading(false)
        if (err.code === 1) setError("يرجى السماح للرابط بالوصول للموقع من إعدادات المتصفح")
        else setError("تعذر تحديد موقعك، تأكد من تشغيل الـ GPS في هاتفك")
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const prayerLabels = [
    { id: "Fajr", n: "الفجر" }, { id: "Dhuhr", n: "الظهر" },
    { id: "Asr", n: "العصر" }, { id: "Maghrib", n: "المغرب" }, { id: "Isha", n: "العشاء" }
  ]

  return (
    <DashboardLayout title="مواقيت الصلاة" description="مواقيت الصلاة حسب موقعك بدقة">
      <div className="max-w-5xl mx-auto space-y-8 pb-16 px-4">
        
        {/* زر تحديد الموقع الجديد - هو الحل للمشكلة */}
        {!times && !error && !loading && (
          <div className="flex flex-col items-center justify-center p-12 bg-indigo-50 rounded-[3rem] border-2 border-dashed border-indigo-200 text-center space-y-4">
             <MapPin size={48} className="text-indigo-500 animate-bounce" />
             <h3 className="text-xl font-black text-indigo-900">أهلاً بك في مواقيت الصلاة</h3>
             <p className="text-indigo-600 max-w-xs text-sm">يجب السماح بالوصول لموقعك الجغرافي لنتمكن من حساب المواقيت بدقة لمكانك الحالي.</p>
             <Button onClick={getLocation} className="bg-indigo-600 hover:bg-indigo-700 h-14 px-10 rounded-2xl font-black text-lg">تحديد موقعي الآن</Button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <RefreshCw size={40} className="text-indigo-500 animate-spin" />
            <p className="font-bold text-indigo-600">جاري تحديد موقعك وجلب المواقيت...</p>
          </div>
        )}

        {error && (
          <div className="p-6 bg-red-50 border border-red-100 rounded-[2rem] text-center space-y-4">
             <AlertCircle className="mx-auto text-red-500" size={32} />
             <p className="text-red-700 font-bold">{error}</p>
             <Button onClick={getLocation} variant="outline" className="rounded-xl border-red-200">حاول مجدداً</Button>
          </div>
        )}

        {times && (
          <>
            {/* عرض المواقيت (نفس تصميمك الجميل السابق) */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 animate-in fade-in zoom-in-95">
              {prayerLabels.map((p) => {
                const isNext = p.n === nextPrayer.name;
                return (
                  <div key={p.id} className={`p-6 rounded-[2rem] border-2 transition-all duration-500 flex flex-col items-center gap-1 ${
                    isNext ? 'bg-slate-900 border-indigo-500 shadow-xl scale-105 z-10' : 'bg-white border-slate-100'
                  }`}>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isNext ? 'text-indigo-400' : 'text-slate-400'}`}>{p.n}</span>
                    <span className={`text-2xl font-black ${isNext ? 'text-white' : 'text-slate-900'}`}>{format12Hour(times[p.id]).split(' ')[0]}</span>
                    <span className={`text-[10px] font-bold ${isNext ? 'text-indigo-300/60' : 'text-slate-300'}`}>{format12Hour(times[p.id]).split(' ')[1]}</span>
                  </div>
                )
              })}
            </div>

            {/* بطاقة الصلاة القادمة */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-900 to-black rounded-[3.5rem] p-12 md:p-20 shadow-2xl">
               <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-right">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/5 rounded-full border border-white/10">
                      <Navigation size={14} className="text-indigo-400" />
                      <span className="text-xs font-bold text-indigo-100 uppercase">{cityName}</span>
                    </div>
                    <h2 className="text-7xl md:text-[10rem] font-black text-white leading-none tracking-tighter">{nextPrayer.name}</h2>
                  </div>
                  <div className="bg-white/5 backdrop-blur-2xl border border-white/10 w-56 h-56 md:w-72 md:h-72 rounded-full flex flex-col items-center justify-center">
                    <Clock className="text-indigo-400 mb-2 animate-pulse" size={40} />
                    <span className="text-6xl md:text-8xl font-black text-white font-mono">{format12Hour(nextPrayer.time).split(' ')[0]}</span>
                    <span className="text-xl font-bold text-indigo-400 tracking-widest uppercase">{format12Hour(nextPrayer.time).split(' ')[1]}</span>
                  </div>
               </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}