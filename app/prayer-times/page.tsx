"use client"

import { useEffect, useState } from "react"
import PrayerCard from "@/components/prayer/PrayerCard"
import NextPrayer from "@/components/prayer/NextPrayer"
import LocationGate from "@/components/prayer/LocationGate"
import SettingsPanel from "@/components/prayer/SettingsPanel"
import { fetchPrayerTimes, calculateNextPrayer } from "@/lib/prayerUtils"

const prayerNamesAr: { [key: string]: string } = {
  Fajr: "الفجر",
  Sunrise: "الشروق",
  Dhuhr: "الظهر",
  Asr: "العصر",
  Maghrib: "المغرب",
  Isha: "العشاء"
};

export default function PrayerPage() {
  const [times, setTimes] = useState<any>(null)
  const [nextPrayer, setNextPrayer] = useState<any>(null)
  const [city, setCity] = useState("جاري تحديد الموقع...")
  const [countdown, setCountdown] = useState("")
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // دالة جلب المدينة بالعربي بناءً على الإحداثيات الدقيقة
  async function getCityName(lat: number, lon: number) {
    try {
      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=ar`
      );
      const data = await res.json();
      // يعطيك اسم المدينة أو الحي بدقة
      return data.city || data.locality || data.principalSubdivision || "موقع غير معروف";
    } catch {
      return "تعذر جلب اسم المدينة";
    }
  }

  const getHighPrecisionLocation = () => {
    if (!navigator.geolocation) {
      setError("متصفحك لا يدعم نظام تحديد المواقع العالمي GPS");
      return;
    }

    const options: PositionOptions = {
      enableHighAccuracy: true, // إجبار الجهاز على تشغيل الـ GPS (Hardware)
      timeout: 20000,           // انتظار 20 ثانية لالتقاط القمر الصناعي
      maximumAge: 0             // عدم قبول أي موقع قديم مخزن (Fresh Data Only)
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // 1. جلب اسم المدينة بالعربي بدقة
        const cityName = await getCityName(latitude, longitude);
        setCity(cityName);

        // 2. جلب مواقيت الصلاة بناءً على الإحداثيات
        const data = await fetchPrayerTimes(latitude, longitude);
        setTimes(data.times);
        const next = calculateNextPrayer(data.times);
        setNextPrayer(next);
        
        setReady(true);
        localStorage.setItem("prayerLocation", JSON.stringify({ latitude, longitude, cityName }));
      },
      (err) => {
        setError("فشل الاتصال بالأقمار الصناعية. تأكد من تفعيل الموقع (Location) في هاتفك.");
      },
      options
    );
  };

  useEffect(() => {
    const saved = localStorage.getItem("prayerLocation");
    if (saved) {
      const loc = JSON.parse(saved);
      loadSaved(loc.latitude, loc.longitude, loc.cityName);
    } else {
      getHighPrecisionLocation();
    }
  }, []);

  async function loadSaved(lat: number, lon: number, name: string) {
    const data = await fetchPrayerTimes(lat, lon);
    setTimes(data.times);
    setCity(name);
    setNextPrayer(calculateNextPrayer(data.times));
    setReady(true);
  }

  // عداد الوقت (نفس المنطق السابق)
  useEffect(() => {
    if (!nextPrayer || !times) return;
    const t = setInterval(() => {
      const now = new Date();
      const [h, m] = nextPrayer.time.split(":");
      const target = new Date();
      target.setHours(parseInt(h), parseInt(m), 0);
      if (target < now) target.setDate(target.getDate() + 1);
      
      const diff = target.getTime() - now.getTime();
      const h2 = Math.floor(diff / 3600000);
      const m2 = Math.floor((diff % 3600000) / 60000);
      const s2 = Math.floor((diff % 60000) / 1000);
      setCountdown(`${h2.toString().padStart(2, '0')}:${m2.toString().padStart(2, '0')}:${s2.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(t);
  }, [nextPrayer, times]);

  if (error) return (
    <div className="min-h-screen bg-[#FDFCF0] flex items-center justify-center p-6 text-center">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-amber-200">
        <p className="text-red-600 font-bold mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="bg-amber-600 text-white px-6 py-2 rounded-xl">إعادة المحاولة</button>
      </div>
    </div>
  );

  if (!ready) return <LocationGate onLocation={getHighPrecisionLocation} />;

  return (
    <div className="min-h-screen bg-[#FDFCF0] text-stone-800 dir-rtl" dir="rtl">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        
        <header className="flex items-center justify-between border-b border-amber-100 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-amber-700">مواقيت الصلاة</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-lg font-medium text-stone-600">{city}</p>
            </div>
          </div>
          <SettingsPanel />
        </header>

        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-amber-50 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/30 rounded-full -mr-16 -mt-16 blur-3xl"></div>
           <NextPrayer 
              prayer={{...nextPrayer, name: prayerNamesAr[nextPrayer?.name] || nextPrayer?.name}} 
              countdown={countdown} 
           />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {times && Object.entries(times).map(([key, val]: any) => (
            <div key={key} className={`p-1 rounded-2xl transition-all ${nextPrayer?.name === key ? 'bg-amber-500 shadow-lg scale-105' : 'bg-white border border-amber-100'}`}>
               <div className="bg-white rounded-[14px] h-full">
                  <PrayerCard name={prayerNamesAr[key] || key} time={val} />
               </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("prayerLocation");
            setReady(false);
            getHighPrecisionLocation();
          }}
          className="w-full md:w-auto px-8 py-3 rounded-2xl bg-white border-2 border-amber-200 text-amber-700 hover:bg-amber-50 transition-all font-bold text-sm shadow-sm"
        >
          تحديث دقيق للموقع (GPS)
        </button>
      </div>
    </div>
  );
}