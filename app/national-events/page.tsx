"use client"
import * as React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Clock } from "lucide-react"

// قاعدة البيانات كاملة لعام 2026 (تم إضافة المغرب ولبنان بنجاح)
const eventsData = {
  saudi: [
    { name: "يوم التأسيس", date: "2026-02-22", type: "وطني" },
    { name: "عيد الفطر المبارك", date: "2026-03-20", type: "ديني" },
    { name: "عيد الأضحى المبارك", date: "2026-05-27", type: "ديني" },
    { name: "رأس السنة الهجرية", date: "2026-06-16", type: "ديني" },
    { name: "اليوم الوطني 96", date: "2026-09-23", type: "وطني" },
  ],
  uae: [
    { name: "رأس السنة الميلادية", date: "2026-01-01", type: "رسمي" },
    { name: "عيد الفطر المبارك", date: "2026-03-20", type: "ديني" },
    { name: "عيد الأضحى المبارك", date: "2026-05-27", type: "ديني" },
    { name: "ذكرى المولد النبوي", date: "2026-08-25", type: "ديني" },
    { name: "يوم العلم", date: "2026-11-03", type: "وطني" },
    { name: "يوم الشهيد", date: "2026-11-30", type: "وطني" },
    { name: "عيد الاتحاد الـ 55", date: "2026-12-02", type: "وطني" },
  ],
  kuwait: [
    { name: "رأس السنة الميلادية", date: "2026-01-01", type: "رسمي" },
    { name: "ذكرى الإسراء والمعراج", date: "2026-02-14", type: "ديني" },
    { name: "اليوم الوطني الكويتي", date: "2026-02-25", type: "وطني" },
    { name: "يوم التحرير", date: "2026-02-26", type: "وطني" },
    { name: "عيد الفطر المبارك", date: "2026-03-20", type: "ديني" },
    { name: "عيد الأضحى المبارك", date: "2026-05-27", type: "ديني" },
    { name: "رأس السنة الهجرية", date: "2026-06-16", type: "ديني" },
    { name: "المولد النبوي الشريف", date: "2026-08-25", type: "ديني" },
  ],
  egypt: [
    { name: "عيد الميلاد المجيد", date: "2026-01-07", type: "ديني" },
    { name: "ثورة 25 يناير", date: "2026-01-25", type: "وطني" },
    { name: "عيد الفطر المبارك", date: "2026-03-20", type: "ديني" },
    { name: "شم النسيم", date: "2026-04-13", type: "رسمي" },
    { name: "عيد تحرير سيناء", date: "2026-04-25", type: "وطني" },
    { name: "عيد العمال", date: "2026-05-01", type: "رسمي" },
    { name: "عيد الأضحى المبارك", date: "2026-05-27", type: "ديني" },
    { name: "ثورة 30 يونيو", date: "2026-06-30", type: "وطني" },
    { name: "ثورة 23 يوليو", date: "2026-07-23", type: "وطني" },
    { name: "ذكرى نصر أكتوبر", date: "2026-10-06", type: "وطني" },
  ],
  qatar: [
    { name: "اليوم الرياضي للدولة", date: "2026-02-10", type: "رسمي" },
    { name: "عيد الفطر المبارك", date: "2026-03-20", type: "ديني" },
    { name: "عيد الأضحى المبارك", date: "2026-05-27", type: "ديني" },
    { name: "اليوم الوطني لقطر", date: "2026-12-18", type: "وطني" },
  ],
  bahrain: [
    { name: "رأس السنة الميلادية", date: "2026-01-01", type: "رسمي" },
    { name: "عيد الفطر المبارك", date: "2026-03-20", type: "ديني" },
    { name: "عيد الأضحى المبارك", date: "2026-05-27", type: "ديني" },
    { name: "المولد النبوي الشريف", date: "2026-08-25", type: "ديني" },
    { name: "العيد الوطني للبحرين", date: "2026-12-16", type: "وطني" },
    { name: "عيد الجلوس الملكي", date: "2026-12-17", type: "وطني" },
  ],
  oman: [
    { name: "ذكرى تولي السلطان", date: "2026-01-11", type: "وطني" },
    { name: "ذكرى الإسراء والمعراج", date: "2026-02-14", type: "ديني" },
    { name: "عيد الفطر المبارك", date: "2026-03-20", type: "ديني" },
    { name: "عيد الأضحى المبارك", date: "2026-05-27", type: "ديني" },
    { name: "رأس السنة الهجرية", date: "2026-06-16", type: "ديني" },
    { name: "اليوم الوطني العماني", date: "2026-11-18", type: "وطني" },
  ],
  jordan: [
    { name: "رأس السنة الميلادية", date: "2026-01-01", type: "رسمي" },
    { name: "عيد الشعانين", date: "2026-04-05", type: "ديني" },
    { name: "عيد الفصح المجيد", date: "2026-04-12", type: "ديني" },
    { name: "عيد العمال", date: "2026-05-01", type: "رسمي" },
    { name: "يوم الاستقلال الأردني", date: "2026-05-25", type: "وطني" },
    { name: "عيد الميلاد المجيد", date: "2026-12-25", type: "ديني" },
  ],
  iraq: [
    { name: "رأس السنة الميلادية", date: "2026-01-01", type: "رسمي" },
    { name: "عيد الجيش العراقي", date: "2026-01-06", type: "وطني" },
    { name: "عيد نوروز", date: "2026-03-21", type: "ثقافي" },
    { name: "عيد العمال", date: "2026-05-01", type: "رسمي" },
    { name: "يوم الجمهورية", date: "2026-07-14", type: "وطني" },
    { name: "يوم النصر العظيم", date: "2026-12-10", type: "وطني" },
  ],
  syria: [
    { name: "رأس السنة الميلادية", date: "2026-01-01", type: "رسمي" },
    { name: "عيد الميلاد المجيد", date: "2026-01-07", type: "ديني" },
    { name: "عيد الثورة", date: "2026-03-08", type: "رسمي" },
    { name: "عيد الأم", date: "2026-03-21", type: "اجتماعي" },
    { name: "عيد الجلاء", date: "2026-04-17", type: "وطني" },
    { name: "عيد الشهداء", date: "2026-05-06", type: "وطني" },
    { name: "ذكرى حرب تشرين", date: "2026-10-06", type: "وطني" },
  ],
  lebanon: [
    { name: "رأس السنة الميلادية", date: "2026-01-01", type: "رسمي" },
    { name: "عيد مار مارون", date: "2026-02-09", type: "ديني" },
    { name: "عيد البشارة", date: "2026-03-25", type: "ديني" },
    { name: "عيد العمال", date: "2026-05-01", type: "رسمي" },
    { name: "عيد المقاومة والتحرير", date: "2026-05-25", type: "وطني" },
    { name: "عيد الاستقلال اللبناني", date: "2026-11-22", type: "وطني" },
    { name: "عيد الميلاد المجيد", date: "2026-12-25", type: "ديني" },
  ],
  morocco: [
    { name: "رأس السنة الميلادية", date: "2026-01-01", type: "رسمي" },
    { name: "تقديم وثيقة الاستقلال", date: "2026-01-11", type: "وطني" },
    { name: "رأس السنة الأمازيغية", date: "2026-01-14", type: "ثقافي" },
    { name: "عيد العمال", date: "2026-05-01", type: "رسمي" },
    { name: "عيد العرش", date: "2026-07-30", type: "وطني" },
    { name: "ذكرى استرداد وادي الذهب", date: "2026-08-14", type: "وطني" },
    { name: "ثورة الملك والشعب", date: "2026-08-20", type: "وطني" },
    { name: "عيد الشباب", date: "2026-08-21", type: "وطني" },
    { name: "ذكرى المسيرة الخضراء", date: "2026-11-06", type: "وطني" },
    { name: "عيد الاستقلال المغربي", date: "2026-11-18", type: "وطني" },
  ],
  yemen: [
    { name: "عيد الفطر المبارك", date: "2026-03-20", type: "ديني" },
    { name: "عيد الوحدة اليمنية", date: "2026-05-22", type: "وطني" },
    { name: "عيد الأضحى المبارك", date: "2026-05-27", type: "ديني" },
    { name: "ثورة 26 سبتمبر", date: "2026-09-26", type: "وطني" },
    { name: "ثورة 14 أكتوبر", date: "2026-10-14", type: "وطني" },
    { name: "عيد الجلاء 30 نوفمبر", date: "2026-11-30", type: "وطني" },
  ],
}

const getHijriDate = (date: string) => {
  const d = new Date(date)
  try {
    return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric', 
      month: 'long', // 
      year: 'numeric'
    }).format(d) + " هـ"
  } catch (e) { return "---" }
}

const calculateDaysLeft = (targetDate: string) => {
  const today = new Date("2026-03-12")
  const target = new Date(targetDate)
  const diff = target.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

const getEventEmoji = (name: string) => {
  if (name.includes("عيد الفطر")) return "🌙"
  if (name.includes("عيد الأضحى")) return "🐑"
  if (name.includes("رأس السنة")) return "🎉"
  if (name.includes("اليوم الوطني") || name.includes("تأسيس") || name.includes("استقلال") || name.includes("تحرير") || name.includes("العرش")) return "🚩"
  if (name.includes("المولد النبوي")) return "🕌"
  return "📅"
}

export default function NationalEventsPage() {
  const countries = [
    { id: "saudi", label: "السعودية", flag: "🇸🇦" },
    { id: "uae", label: "الإمارات", flag: "🇦🇪" },
    { id: "kuwait", label: "الكويت", flag: "🇰🇼" },
    { id: "egypt", label: "مصر", flag: "🇪🇬" },
    { id: "qatar", label: "قطر", flag: "🇶🇦" },
    { id: "bahrain", label: "البحرين", flag: "🇧🇭" },
    { id: "oman", label: "عمان", flag: "🇴🇲" },
    { id: "jordan", label: "الأردن", flag: "🇯🇴" },
    { id: "iraq", label: "العراق", flag: "🇮🇶" },
    { id: "syria", label: "سوريا", flag: "🇸🇾" },
    { id: "lebanon", label: "لبنان", flag: "🇱🇧" },
    { id: "morocco", label: "المغرب", flag: "🇲🇦" },
    { id: "yemen", label: "اليمن", flag: "🇾🇪" },
  ]

  return (
    <DashboardLayout title="الأجندة الوطنية 2026" description="المناسبات والعطلات الرسمية">
      <div className="max-w-5xl mx-auto px-4 sm:px-0 space-y-6">
        
<Tabs defaultValue="saudi" dir="rtl" className="w-full">
          <div className="w-full overflow-hidden mb-8">
            <TabsList 
              className="
                flex w-full overflow-x-auto no-scrollbar bg-gray-100 p-1.5 rounded-2xl h-16 border-2 border-gray-200 shadow-sm gap-1 scroll-smooth
/* التعديل هنا: غيرنا justify-between إلى justify-start وأضفنا min-w-max */
md:justify-start md:min-w-max
              "
              style={{ scrollPadding: '0 50px' }}
            >
              {countries.map((c) => (
                <TabsTrigger 
                  key={c.id} 
                  value={c.id} 
                  onClick={(e) => {
                    e.currentTarget.scrollIntoView({ 
                      behavior: 'smooth', 
                      inline: 'center', 
                      block: 'nearest' 
                    });
                  }}
                  className="
                    flex-shrink-0 px-5 py-2 whitespace-nowrap
                    md:flex-1 md:px-2
                    text-[11px] md:text-sm font-black rounded-xl transition-all 
                    data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-md
                  "
                >
                  <span className="ml-1.5 text-base md:text-lg">{c.flag}</span>
                  {c.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {Object.entries(eventsData).map(([country, events]) => (
            <TabsContent key={country} value={country} className="space-y-4 mt-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {events.map((event, index) => {
                const daysLeft = calculateDaysLeft(event.date)
                const isPassed = daysLeft < 0
                const hijri = getHijriDate(event.date)

                return (
                  <Card key={index} className={`border-2 transition-all ${isPassed ? 'opacity-40 bg-gray-50' : 'hover:border-black shadow-md bg-white border-gray-100'}`}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl shrink-0">{getEventEmoji(event.name)}</span>
                        <div>
                          <h3 className="font-black text-gray-900 text-sm md:text-base">{event.name}</h3>
                          <div className="flex flex-col gap-1 text-[11px] font-bold text-gray-500 mt-1">
                            <div className="flex items-center gap-2">
                              <CalendarDays size={14} className="text-black" />
                              <span>{event.date} م</span>
                            </div>
                            <div className="flex items-center gap-2 opacity-70">
                              <Clock size={12} className="text-black" />
                              <span>{hijri}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 ml-2">
                        {isPassed ? (
                          <span className="text-[10px] font-black text-gray-400 bg-gray-200 px-2 py-1 rounded-md italic">مضت</span>
                        ) : (
                          <div className="flex flex-col items-center justify-center bg-gray-50 border border-gray-100 rounded-xl px-3 py-1 min-w-[65px]">
                            <span className="text-xl md:text-2xl font-black text-black leading-none">{daysLeft}</span>
                            <span className="text-[8px] font-bold text-gray-400 uppercase text-center mt-1">يوم متبقي</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </TabsContent>
          ))}
        </Tabs>

        <div className="bg-white border-2 border-black p-4 rounded-3xl flex items-center gap-3 shadow-md">
          <Clock className="text-black shrink-0" size={20} />
          <p className="text-[11px] font-black leading-tight italic text-gray-700">
            ملاحظة: التواريخ الهجرية تقديرية لعام 2026 وتعتمد على رؤية الهلال الرسمية.
          </p>
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </DashboardLayout>
  )
}