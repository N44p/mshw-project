"use client"

import { useEffect, useState } from "react"
// استيراد المكونات من المسارات الجديدة
import { PrayerMainLayout } from "@/components/layouts/PrayerMainLayout"
import HeroClock from "@/components/modules/HeroClock"
import PrayerGrid from "@/components/modules/PrayerGrid"
import { StatusBadge } from "@/components/prayer/ui/StatusBadge"
import { GoldenButton } from "@/components/prayer/ui/GoldenButton"
// استيراد الوظائف المساعدة (تأكد من وجودها في lib)
import { fetchPrayerTimes, calculateNextPrayer } from "@/lib/prayerUtils"

const PRAYER_LABELS: any = {
  Fajr: "الفجر", Sunrise: "الشروق", Dhuhr: "الظهر", 
  Asr: "العصر", Maghrib: "المغرب", Isha: "العشاء"
};

export default function PrayerPage() {
  const [times, setTimes] = useState<any>(null)
  const [nextPrayer, setNextPrayer] = useState<any>(null)
  const [city, setCity] = useState("جاري التحديد...")
  const [countdown, setCountdown] = useState("00:00:00")
  const [loading, setLoading] = useState(true)

  // دالة تحديد الموقع
  const handleGPS = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const data = await fetchPrayerTimes(latitude, longitude);
      setTimes(data.times);
      setNextPrayer(calculateNextPrayer(data.times));
      setLoading(false);
      setCity("موقعك الحالي"); // يمكنك استدعاء دالة اسم المدينة هنا
    });
  };

  useEffect(() => {
    handleGPS();
  }, []);

  // عداد الوقت
  useEffect(() => {
    if (!nextPrayer) return;
    const t = setInterval(() => {
      const now = new Date();
      const [h, m] = nextPrayer.time.split(":");
      const target = new Date();
      target.setHours(parseInt(h), parseInt(m), 0);
      if (target < now) target.setDate(target.getDate() + 1);
      
      const diff = target.getTime() - now.getTime();
      const h2 = Math.floor(diff / 3600000).toString().padStart(2, '0');
      const m2 = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
      const s2 = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
      setCountdown(`${h2}:${m2}:${s2}`);
    }, 1000);
    return () => clearInterval(t);
  }, [nextPrayer]);

  if (loading) return <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center text-[#D4AF37]">جاري التحميل...</div>;

  // الـ Return يجب أن يكون داخل دالة المكون PrayerPage
  return (
    <PrayerMainLayout>
      <header className="flex flex-col md:flex-row justify-between items-center gap-6">
        <h1 className="text-3xl font-serif font-bold text-[#5C5447]">مواقيت الصلاة</h1>
        <StatusBadge city={city} />
      </header>

      <HeroClock 
        name={PRAYER_LABELS[nextPrayer?.name]} 
        countdown={countdown} 
        time={nextPrayer?.time} 
      />

      <PrayerGrid 
        times={times} 
        nextPrayerName={nextPrayer?.name} 
        labels={PRAYER_LABELS} 
      />

      <div className="flex justify-center pt-8">
        <GoldenButton onClick={handleGPS} icon="📍">
          تحديث الموقع التلقائي
        </GoldenButton>
      </div>
    </PrayerMainLayout>
  );
}