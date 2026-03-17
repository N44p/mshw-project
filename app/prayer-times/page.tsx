"use client"

import { useEffect, useState } from "react"
import { PrayerMainLayout } from "@/components/layouts/PrayerMainLayout"
import HeroClock from "@/components/modules/HeroClock"
import PrayerGrid from "@/components/modules/PrayerGrid"
import { StatusBadge } from "@/components/prayer/ui/StatusBadge"
import { fetchPrayerTimes, calculateNextPrayer } from "@/lib/prayerUtils"

const PRAYER_LABELS: any = {
  Fajr: "الفجر",
  Sunrise: "الشروق",
  Dhuhr: "الظهر",
  Asr: "العصر",
  Maghrib: "المغرب",
  Isha: "العشاء"
};

// قائمة المدن
const CITIES = [
  { name: "دبي", lat: 25.2048, lng: 55.2708 },
  { name: "الرياض", lat: 24.7136, lng: 46.6753 },
  { name: "جدة", lat: 21.4858, lng: 39.1925 },
  { name: "أبو ظبي", lat: 24.4539, lng: 54.3773 },
  { name: "الكويت", lat: 29.3759, lng: 47.9774 },
  { name: "المنامة", lat: 26.2285, lng: 50.5860 },
  { name: "الدوحة", lat: 25.2854, lng: 51.5310 },
  { name: "القاهرة", lat: 30.0444, lng: 31.2357 },
  { name: "صنعاء", lat: 15.3694, lng: 44.1910 },
  { name: "عدن", lat: 12.7855, lng: 45.0186 },
  { name: "مأرب", lat: 15.4591, lng: 45.3253 },
  { name: "حضر موت", lat: 15.8395, lng: 48.4735 },
  { name: "الاسكندرية", lat: 31.2001, lng: 29.9187 },
  { name: "شرم الشيخ", lat: 27.9158, lng: 34.3299 },
  { name: "المنوفية", lat: 30.5972, lng: 30.9876 },
  { name: "السويس", lat: 29.9668, lng: 32.5498 },
  { name: "عمان", lat: 31.9454, lng: 35.9284 },
  { name: "دمشق", lat: 33.5138, lng: 36.2765 },
  { name: "حلب", lat: 36.2021, lng: 37.1343 },
  { name: "بغداد", lat: 33.3152, lng: 44.3661 },
  { name: "الموصل", lat: 36.3489, lng: 43.1577 },
  { name: "مسقط", lat: 23.5859, lng: 58.4059 },
  { name: "بيروت", lat: 33.8938, lng: 35.5018 },
];

export default function PrayerPage() {
  const [times, setTimes] = useState<any>(null)
  const [nextPrayer, setNextPrayer] = useState<any>(null)
  const [city, setCity] = useState("الرياض")
  const [countdown, setCountdown] = useState("00:00:00")
  const [loading, setLoading] = useState(true)

  // جلب البيانات حسب المدينة
  const loadPrayerData = async (cityName: string) => {
    setLoading(true)
    const selectedCity = CITIES.find(c => c.name === cityName) || CITIES[0]

    try {
      const data = await fetchPrayerTimes(selectedCity.lat, selectedCity.lng)
      setTimes(data.times)
      setNextPrayer(calculateNextPrayer(data.times))
      setCity(selectedCity.name)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // أول تحميل
  useEffect(() => {
    loadPrayerData(city)
  }, [])

  // العداد
  useEffect(() => {
    if (!nextPrayer) return

    const t = setInterval(() => {
      const now = new Date()
      const [h, m] = nextPrayer.time.split(":")
      const target = new Date()

      target.setHours(parseInt(h), parseInt(m), 0)
      if (target < now) target.setDate(target.getDate() + 1)

      const diff = target.getTime() - now.getTime()

      const h2 = Math.floor(diff / 3600000).toString().padStart(2, '0')
      const m2 = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0')
      const s2 = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0')

      setCountdown(`${h2}:${m2}:${s2}`)
    }, 1000)

    return () => clearInterval(t)
  }, [nextPrayer])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center text-[#D4AF37]">
        جاري تحميل المواقيت...
      </div>
    )
  }

  return (
    <PrayerMainLayout>
      <header className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#5C5447]">
            مواقيت الصلاة
          </h1>
          <p className="text-sm text-[#8B7E66]">
            اختر المدينة لعرض التوقيت
          </p>
        </div>
        <StatusBadge city={city} />
      </header>

      {/* اختيار المدينة */}
      <div className="flex flex-col items-center gap-4 my-6">
        <label className="text-[#5C5447] font-medium">اختر المدينة:</label>

        <select
          value={city}
          onChange={(e) => loadPrayerData(e.target.value)}
          className="bg-white border-2 border-[#D4AF37] text-[#5C5447] rounded-lg px-4 py-2"
        >
          {CITIES.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

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

      <footer className="mt-12 text-center text-[#8B7E66] text-sm italic">
        * التواقيت تقريبية وتعتمد على طريقة الحساب الجغرافي
      </footer>
    </PrayerMainLayout>
  )
}