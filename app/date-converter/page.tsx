"use client"

import { useState, useEffect, useMemo } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type AgeResult = { y: number; m: number; d: number }

function getStrictHijri(day: string, month: string, year: string) {

  const d = parseInt(day)
  const m = parseInt(month)
  const y = parseInt(year)

  if (!d || !m || !y) {
    return { d: "-", m: "تاريخ غير صحيح", y: "-" }
  }

  try {

    const date = new Date(y, m - 1, d)

    const parts = new Intl.DateTimeFormat(
      "ar-SA-u-ca-islamic-umalqura-nu-latn",
      {
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    ).formatToParts(date)

    const hDay = parts.find(p => p.type === "day")?.value
    const hMonth = parts.find(p => p.type === "month")?.value
    const hYear = parts.find(p => p.type === "year")?.value

    return {
      d: hDay,
      m: hMonth,
      y: hYear
    }

  } catch {
    return { d: "-", m: "خطأ", y: "-" }
  }
}

export default function DateConverterPage() {

  const [ageDay, setAgeDay] = useState("12")
  const [ageMonth, setAgeMonth] = useState("12")
  const [ageYear, setAgeYear] = useState("2001")
  const [ageResult, setAgeResult] = useState<AgeResult | string | null>(null)

  const [convDay, setConvDay] = useState("12")
  const [convMonth, setConvMonth] = useState("12")
  const [convYear, setConvYear] = useState("2001")

  useEffect(() => {

    const d = parseInt(ageDay)
    const m = parseInt(ageMonth)
    const y = parseInt(ageYear)

    if (!d || !m || !y) return

    const birth = new Date(y, m - 1, d)
    const now = new Date()

    if (birth > now) {
      setAgeResult("future")
      return
    }

    let years = now.getFullYear() - birth.getFullYear()
    let months = now.getMonth() - birth.getMonth()
    let days = now.getDate() - birth.getDate()

    if (days < 0) {
      months--
      days += new Date(now.getFullYear(), now.getMonth(), 0).getDate()
    }

    if (months < 0) {
      years--
      months += 12
    }

    setAgeResult({ y: years, m: months, d: days })

  }, [ageDay, ageMonth, ageYear])


  const hijri = useMemo(() => {
    return getStrictHijri(convDay, convMonth, convYear)
  }, [convDay, convMonth, convYear])


  return (
    <DashboardLayout title="المحول الذكي" description="تحويل دقيق بدون تداخل">

      <div className="max-w-3xl mx-auto" dir="rtl">

        <Tabs defaultValue="age" className="w-full">

          <TabsList className="flex w-full gap-2 bg-transparent mb-8">
            <TabsTrigger value="age" className="flex-1 h-14 rounded-2xl border-2 border-black font-black data-[state=active]:bg-black data-[state=active]:text-white">
              حساب العمر
            </TabsTrigger>

            <TabsTrigger value="conv" className="flex-1 h-14 rounded-2xl border-2 border-black font-black data-[state=active]:bg-black data-[state=active]:text-white">
              محول التاريخ
            </TabsTrigger>
          </TabsList>


          <TabsContent value="age" className="space-y-6">

            <Card className="border-[3px] border-black shadow-xl rounded-3xl overflow-hidden">

              <div className="bg-black text-white py-2 text-center text-[10px] font-bold tracking-[0.2em]">
                الميلادي
              </div>

              <CardContent className="p-8 flex gap-4 justify-center items-center" dir="ltr">

                <Input
                  type="number"
                  value={ageYear}
                  onChange={(e) => setAgeYear(e.target.value)}
                  className="h-14 text-xl font-black text-center border-2 border-black rounded-xl w-28"
                />

                <Input
                  type="number"
                  value={ageMonth}
                  onChange={(e) => setAgeMonth(e.target.value)}
                  className="h-14 text-xl font-black text-center border-2 border-black rounded-xl w-20"
                />

                <Input
                  type="number"
                  value={ageDay}
                  onChange={(e) => setAgeDay(e.target.value)}
                  className="h-14 text-xl font-black text-center border-2 border-black rounded-xl w-20"
                />

              </CardContent>

            </Card>

            {typeof ageResult === "object" && ageResult && (
              <div className="bg-white border-[3px] border-black p-8 rounded-[2rem] flex justify-around items-center shadow-xl">
                <Unit v={ageResult.y} l="سنة" />
                <Unit v={ageResult.m} l="شهر" />
                <Unit v={ageResult.d} l="يوم" />
              </div>
            )}

          </TabsContent>


          <TabsContent value="conv" className="space-y-6">

            <Card className="border-[3px] border-black shadow-xl rounded-3xl overflow-hidden">

              <div className="bg-black text-white py-2 text-center text-[10px] font-bold tracking-[0.2em]">
                الميلادي المراد تحويله
              </div>

              <CardContent className="p-8 flex gap-4 justify-center items-center" dir="ltr">

                <Input
                  type="number"
                  value={convYear}
                  onChange={(e) => setConvYear(e.target.value)}
                  className="h-14 text-xl font-black text-center border-2 border-black rounded-xl w-28"
                />

                <Input
                  type="number"
                  value={convMonth}
                  onChange={(e) => setConvMonth(e.target.value)}
                  className="h-14 text-xl font-black text-center border-2 border-black rounded-xl w-20"
                />

                <Input
                  type="number"
                  value={convDay}
                  onChange={(e) => setConvDay(e.target.value)}
                  className="h-14 text-xl font-black text-center border-2 border-black rounded-xl w-20"
                />

              </CardContent>

            </Card>


            <div className="bg-white border-[3px] border-black p-12 rounded-[2.5rem] text-center shadow-xl">

              <span className="text-gray-400 font-bold block mb-6 text-xs tracking-widest">
                التاريخ الهجري المقابل
              </span>

              <div className="flex justify-center items-center gap-6">

                <Unit v={Number(hijri.d)} l="يوم" />

                <div className="h-12 w-[2px] bg-gray-100" />

                <div className="flex flex-col px-4">
  <span className="text-1xl font-black text-black leading-none">
    {hijri.m}
  </span>
  <span className="text-[12px] font-bold text-gray-400 mt-2">
    شهر هجري
  </span>
</div>

                <div className="h-12 w-[2px] bg-gray-100" />

                <Unit v={Number(hijri.y)} l="سنة هـ" />

              </div>

            </div>

          </TabsContent>

        </Tabs>

      </div>

    </DashboardLayout>
  )
}


function Unit({ v, l }: { v: number; l: string }) {
  return (
    <div className="text-center">
    <span className="block text-4xl font-black text-black leading-none">{isNaN(v) ? "0" : v.toString()}</span>
    <span className="text-[10px] font-bold text-gray-400 uppercase mt-1">{l}</span>
    </div>
  )
}