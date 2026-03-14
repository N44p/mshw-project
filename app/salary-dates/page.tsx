"use client"
import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import Head from 'next/head'

const countriesData = {
  sa: { 
    name: "السعودية 🇸🇦", 
    bgColor: "bg-emerald-50", 
    items: [
      { title: "الرواتب الحكومية 💰", day: 27, emoji: "💸" }, 
      { title: "التقاعد والتأمينات 👴", day: 1, emoji: "⌛" }, 
      { title: "الضمان الاجتماعي 🛡️", day: 1, emoji: "🤝" }, 
      { title: "حساب المواطن 🏠", day: 10, emoji: "🏦" }
    ] 
  },
  kw: { 
    name: "الكويت 🇰🇼", 
    bgColor: "bg-sky-50", 
    items: [
      { title: "الرواتب الحكومية 💰", day: 24, emoji: "🏦" }, 
      { title: "تأمينات المتقاعدين 👴", day: 10, emoji: "⌛" }, 
      { title: "المساعدات العامة 🎁", day: 19, emoji: "🤲" }, 
      { title: "دعم العمالة 💼", day: 22, emoji: "🏗️" }
    ] 
  },
  ae: { 
    name: "الإمارات 🇦🇪", 
    bgColor: "bg-red-50", 
    items: [
      { title: "الرواتب الاتحادية 💰", day: 27, emoji: "💸" }, 
      { title: "المساعدات الاجتماعية 🤝", day: 1, emoji: "🎁" }, 
      { title: "دعم نافس وعلاوة الأبناء 🚀", day: 28, emoji: "📈" }
    ] 
  },
  qa: { 
    name: "قطر 🇶🇦", 
    bgColor: "bg-purple-50", 
    items: [
      { title: "الرواتب الحكومية 💰", day: 25, emoji: "💸" }, 
      { title: "المعاشات والتقاعد 👴", day: 25, emoji: "⌛" }, 
      { title: "الضمان الاجتماعي 🛡️", day: 1, emoji: "🤝" }
    ] 
  },
  bh: { 
    name: "البحرين 🇧🇭", 
    bgColor: "bg-red-50", 
    items: [
      { title: "الرواتب الحكومية 💰", day: 25, emoji: "🏦" }, 
      { title: "التقاعد والتأمينات 👴", day: 15, emoji: "⌛" }, 
      { title: "دعم الغلاء 🛡️", day: 15, emoji: "🤝" }
    ] 
  },
  om: { 
    name: "عمان 🇴🇲", 
    bgColor: "bg-red-50", 
    items: [
      { title: "الرواتب الحكومية 💰", day: 24, emoji: "💸" }, 
      { title: "منفعة الأمان الوظيفي 🛡️", day: 28, emoji: "🤝" }, 
      { title: "صندوق الحماية الاجتماعية 👴", day: 1, emoji: "⌛" }
    ] 
  },
  jo: { 
    name: "الأردن 🇯🇴", 
    bgColor: "bg-green-50", 
    items: [
      { title: "الرواتب الحكومية 💰", day: 24, emoji: "💸" }, 
      { title: "المعونة الوطنية 🤝", day: 1, emoji: "🏠" }, 
      { title: "رواتب المتقاعدين 👴", day: 20, emoji: "⌛" }
    ] 
  },
  iq: { 
    name: "العراق 🇮🇶", 
    isUnstable: true, 
    bgColor: "bg-gray-50", 
    items: [
      { title: "الرواتب 💰", day: 22, emoji: "💸" }, 
      { title: "رواتب المتقاعدين 👴", day: 1, emoji: "⌛" }, 
      { title: "الرعاية الاجتماعية 🛡️", day: 1, emoji: "🤝" }
    ] 
  },
  sy: { 
    name: "سوريا 🇸🇾", 
    isUnstable: true, 
    bgColor: "bg-red-50", 
    items: [
      { title: "رواتب الموظفين 💰", day: 1, emoji: "💸" }, 
      { title: "رواتب المتقاعدين 👴", day: 1, emoji: "⌛" }
    ] 
  },
  ye: { 
    name: "اليمن 🇾🇪", 
    isUnstable: true, 
    bgColor: "bg-gray-50", 
    items: [
      { title: "رواتب الموظفين 💰", day: 1, emoji: "💸" }, 
      { title: "الرعاية الاجتماعية 🤝", day: 1, emoji: "🏠" }
    ] 
  },
  eg: { 
    name: "مصر 🇪🇬", 
    bgColor: "bg-amber-50", 
    items: [
      { title: "رواتب الموظفين 💰", day: 23, emoji: "💸" }, 
      { title: "المعاشات والتأمينات 🏦", day: 1, emoji: "👴" }, 
      { title: "تكافل وكرامة 👨‍👩‍👧‍👦", day: 15, emoji: "🤝" }
    ] 
  }
}

export default function SalaryDatesPage() {
  const [selectedCountry, setSelectedCountry] = useState<keyof typeof countriesData>("sa")
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // دالة لحساب اسم اليوم الذي يوافق تاريخ الصرف القادم
  const getTargetDayName = (dayNumber: number) => {
    const tempDate = new Date(now.getFullYear(), now.getMonth(), dayNumber);
    // إذا كان اليوم المختار قد مضى في الشهر الحالي، نحسب اسم اليوم في الشهر القادم
    if (now.getDate() > dayNumber) {
      tempDate.setMonth(tempDate.getMonth() + 1);
    }
    return new Intl.DateTimeFormat('ar-SA', { weekday: 'long' }).format(tempDate);
  }

  const getCountdown = (targetDay: number) => {
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()
    let targetDate = new Date(currentYear, currentMonth, targetDay, 0, 0, 0)
    
    if (now > targetDate) {
      targetDate = new Date(currentYear, currentMonth + 1, targetDay, 0, 0, 0)
    }

    const diff = targetDate.getTime() - now.getTime()
    
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      mins: Math.floor((diff / 1000 / 60) % 60),
      isToday: now.getDate() === targetDay
    }
  }

  // كود الـ Schema للـ SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "عداد مواعيد الرواتب والدعم 2026",
    "description": "أداة ذكية لمتابعة مواعيد صرف الرواتب وحساب المواطن في الدول العربية والخليج بدقة.",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "All"
  };

  return (
    <DashboardLayout title="الرواتب والدعم" description="مواعيد الصرف الرسمية لعام 2026">
      {/* حقن الـ SEO داخل الهيد */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="max-w-6xl mx-auto px-4" dir="rtl">
        
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {Object.entries(countriesData).map(([key, data]) => (
            <button key={key} onClick={() => setSelectedCountry(key as any)}
              className={`px-5 py-2.5 rounded-2xl text-sm font-black transition-all duration-300 border-2 flex items-center gap-2 ${selectedCountry === key ? "bg-black text-white border-black shadow-lg scale-105" : "bg-white text-gray-500 border-gray-100 hover:border-gray-300"}`}>
              {data.name}
            </button>
          ))}
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 pt-6">
          {countriesData[selectedCountry].items.map((item, index) => {
            const time = getCountdown(item.day)
            const isUnstable = (countriesData[selectedCountry] as any).isUnstable;

            return (
              <Card key={index} className="relative border-2 border-gray-100 bg-white rounded-[2.5rem] pt-4 shadow-sm hover:shadow-xl transition-all h-full">
                
                <div className="absolute -top-4 -right-2 bg-[#8B5CF6] border-2 border-black px-4 py-1 rounded-xl font-black text-[10px] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-6 z-10">
                   {time.isToday ? "⚡ حان الموعد" : `⏳ متبقي ${time.days} يوم`}
                </div>

                <CardContent className="p-10 text-center flex flex-col justify-between h-full">
                  <div>
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-3xl ${countriesData[selectedCountry].bgColor}`}>
                      {item.emoji}
                    </div>
                    
                    <h3 className="text-lg font-black text-gray-900 mb-1 leading-tight">{item.title}</h3>
                    <p className="text-[13px] font-bold text-gray-900 mb-8 tracking-widest italic">
                      يوم {item.day} ميلادي {isUnstable ? "تقريباً" : ""}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    {/* عرض اسم اليوم الموافق لتاريخ الصرف بدقة */}
                    <div className="mb-3 text-[12px] font-black text-white bg-[#8B5CF6] px-4 py-1 rounded-full shadow-sm">
                       يصادف يوم {getTargetDayName(item.day)}
                    </div>

                    <div className="flex gap-4 items-baseline text-black" dir="ltr">
                      <TimePart value={time.days} label="يوم" isLarge={true} />
                      <span className="text-xl font-black opacity-10">:</span>
                      <TimePart value={time.hours} label="ساعة" />
                      <span className="text-xl font-black opacity-10">:</span>
                      <TimePart value={time.mins} label="دقيقة" />
                    </div>
                    
                    {!time.isToday && (
                      <div className="mt-6 text-[9px] font-black text-[#8B5CF6] animate-pulse tracking-[0.2em] uppercase">
                        جاري العد التنازلي للحظة الصرف..
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}

function TimePart({ value, label, isLarge = false }: { value: number, label: string, isLarge?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <span className={`${isLarge ? 'text-4xl' : 'text-3xl'} font-black tabular-nums tracking-tighter`}>
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[8px] font-bold text-gray-400 uppercase mt-1">{label}</span>
    </div>
  )
}