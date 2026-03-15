"use client"

import { useEffect, useState } from "react"
import PrayerCard from "@/components/prayer/PrayerCard"
import NextPrayer from "@/components/prayer/NextPrayer"
import LocationGate from "@/components/prayer/LocationGate"
import SettingsPanel from "@/components/prayer/SettingsPanel"
// ملاحظة: تأكد من وجود دوال fetchPrayerTimes و calculateNextPrayer في ملف utils لديك
import { fetchPrayerTimes, calculateNextPrayer } from "@/lib/prayerUtils"

export default function PrayerPage() {
  const [times, setTimes] = useState<any>(null)
  const [nextPrayer, setNextPrayer] = useState<any>(null)
  const [city, setCity] = useState("")
  const [countdown, setCountdown] = useState("")
  const [ready, setReady] = useState(false)

  async function load(lat: number, lon: number) {
    const data = await fetchPrayerTimes(lat, lon)
    setTimes(data.times)
    setCity(data.city)
    const next = calculateNextPrayer(data.times)
    setNextPrayer(next)
    setReady(true)
    // حفظ الموقع للمرات القادمة
    localStorage.setItem("prayerLocation", JSON.stringify({ lat, lon }))
  }

  useEffect(() => {
    const saved = localStorage.getItem("prayerLocation")
    if (saved) {
      const loc = JSON.parse(saved)
      load(loc.lat, loc.lon)
    }
  }, [])

  useEffect(() => {
    if (!nextPrayer) return
    const t = setInterval(() => {
      const now = new Date()
      const target = new Date()
      const [h, m] = nextPrayer.time.split(":")
      target.setHours(parseInt(h), parseInt(m), 0)
      const diff = target.getTime() - now.getTime()
      
      if (diff <= 0) {
        // تحديث الصلاة القادمة إذا انتهى الوقت
        const next = calculateNextPrayer(times)
        setNextPrayer(next)
        return
      }
      
      const h2 = Math.floor(diff / 3600000)
      const m2 = Math.floor((diff % 3600000) / 60000)
      const s2 = Math.floor((diff % 60000) / 1000)
      setCountdown(`${h2.toString().padStart(2, '0')}:${m2.toString().padStart(2, '0')}:${s2.toString().padStart(2, '0')}`)
    }, 1000)
    return () => clearInterval(t)
  }, [nextPrayer, times])

  if (!ready) return <LocationGate onLocation={load} />

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">مواقيت الصلاة</h1>
            <p className="text-sm opacity-70">{city}</p>
          </div>
          <SettingsPanel />
        </header>

        <NextPrayer prayer={nextPrayer} countdown={countdown} />

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {times && Object.entries(times).map(([key, val]: any) => (
            <PrayerCard key={key} name={key} time={val} />
          ))}
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("prayerLocation")
            setReady(false)
          }}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition mt-6 text-sm"
        >
          تغيير الموقع
        </button>
      </div>
    </div>
  )
}