"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Coins, Loader2, ArrowLeftRight } from "lucide-react"

export default function CurrencyConverterPage() {
  const [amount, setAmount] = useState<string>("100")
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("EGP") // جعلنا الجنيه المصري هو الهدف الافتراضي
  const [rates, setRates] = useState<any>({})
  const [loading, setLoading] = useState(true)

  // جلب الأسعار الحقيقية من API مجاني
  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true)
        const res = await fetch(`https://open.er-api.com/v6/latest/USD`)
        const data = await res.json()
        setRates(data.rates)
        setLoading(false)
      } catch (error) {
        console.error("خطأ في جلب الأسعار")
        // وضع أسعار احتياطية في حال انقطاع الإنترنت
        setRates({ USD: 1, EGP: 51, SAR: 3.75, AED: 3.67 })
        setLoading(false)
      }
    }
    fetchRates()
  }, [])

  const convert = () => {
    if (!rates[fromCurrency] || !rates[toCurrency]) return "0.00"
    const num = parseFloat(amount) || 0
    const result = (num / rates[fromCurrency]) * rates[toCurrency]
    return result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  if (loading) return (
    <DashboardLayout title="محول العملات" description="جاري جلب أسعار الصرف الحية...">
      <div className="flex justify-center p-20"><Loader2 className="animate-spin text-amber-500" size={40} /></div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout title="محول العملات الحي" description="أسعار صرف حقيقية محدثة لعام 2026">
      <div className="max-w-md mx-auto space-y-6">
        <Card className="border-t-4 border-t-amber-500 shadow-xl overflow-hidden">
          <CardHeader className="text-center bg-amber-50/50">
             <Coins className="w-10 h-10 text-amber-500 mx-auto mb-2" />
             <CardTitle>حول أموالك بدقة</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 pr-1">المبلغ</label>
              <Input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                className="text-2xl h-16 text-center font-bold border-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center">
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - دولار</SelectItem>
                  <SelectItem value="SAR">SAR - ريال</SelectItem>
                  <SelectItem value="EGP">EGP - جنيه</SelectItem>
                </SelectContent>
              </Select>

              <ArrowLeftRight className="text-gray-300" size={20} />

              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="EGP">EGP - جنيه</SelectItem>
                  <SelectItem value="SAR">SAR - ريال</SelectItem>
                  <SelectItem value="USD">USD - دولار</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-6 p-8 bg-amber-500 rounded-3xl text-white text-center shadow-lg">
              <p className="text-amber-100 text-sm mb-1">النتيجة الحقيقية:</p>
              <h2 className="text-4xl font-black tracking-tighter">{convert()}</h2>
              <p className="mt-1 font-bold opacity-80">{toCurrency}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}