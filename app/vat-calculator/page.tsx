"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Percent, Coins } from "lucide-react"

export default function AdvancedVatCalculator() {
  const [amount, setAmount] = useState<string>("")
  const [currency, setCurrency] = useState<string>("SAR")
  const [taxes, setTaxes] = useState([{ id: 1, name: "ضريبة القيمة المضافة", rate: 15 }])

  const numAmount = parseFloat(amount) || 0

  // إضافة ضريبة جديدة
  const addTax = () => {
    setTaxes([...taxes, { id: Date.now(), name: "ضريبة إضافية", rate: 5 }])
  }

  // حذف ضريبة
  const removeTax = (id: number) => {
    if (taxes.length > 1) {
      setTaxes(taxes.filter(t => t.id !== id))
    }
  }

  // تحديث بيانات الضريبة
  const updateTax = (id: number, field: 'name' | 'rate', value: any) => {
    setTaxes(taxes.map(t => t.id === id ? { ...t, [field]: value } : t))
  }

  // الحسابات النهائية
  const totalTaxAmount = taxes.reduce((acc, tax) => acc + (numAmount * (tax.rate / 100)), 0)
  const finalTotal = numAmount + totalTaxAmount

  return (
    <DashboardLayout title="حاسبة الضرائب المتطورة" description="قم بتخصيص الضرائب والعملات حسب احتياجك">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-t-4 border-t-rose-500 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="text-right">
              <CardTitle className="text-2xl font-bold">الحساب الضريبي</CardTitle>
              <CardDescription>أدخل المبلغ والعملة والضرائب المطبقة</CardDescription>
            </div>
            <Percent className="h-8 w-8 text-rose-500 opacity-20" />
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 text-right">
                <Label>المبلغ الأساسي</Label>
                <Input 
                  type="number" 
                  placeholder="0.00" 
                  className="py-6 text-lg" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                />
              </div>
              <div className="space-y-2 text-right">
                <Label>العملة</Label>
                <Select onValueChange={setCurrency} defaultValue={currency}>
                  <SelectTrigger className="py-6">
                    <SelectValue placeholder="اختر العملة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
                    <SelectItem value="AED">درهم إماراتي (AED)</SelectItem>
                    <SelectItem value="KWD">دينار كويتي (KWD)</SelectItem>
                    <SelectItem value="EGP">جنيه مصري (EGP)</SelectItem>
                    <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <Button onClick={addTax} variant="outline" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" /> إضافة ضريبة أخرى
                </Button>
                <Label className="font-bold">قائمة الضرائب المطبقة</Label>
              </div>

              {taxes.map((tax) => (
                <div key={tax.id} className="flex gap-2 items-end bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <Button variant="ghost" size="icon" onClick={() => removeTax(tax.id)} className="text-rose-500 hover:bg-rose-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <div className="flex-1 space-y-1">
                    <Input 
                      className="h-8 text-xs" 
                      value={tax.name} 
                      onChange={(e) => updateTax(tax.id, 'name', e.target.value)}
                    />
                  </div>
                  <div className="w-24 space-y-1">
                    <div className="relative">
                      <Input 
                        type="number" 
                        className="h-8 pl-6 text-center" 
                        value={tax.rate} 
                        onChange={(e) => updateTax(tax.id, 'rate', parseFloat(e.target.value) || 0)}
                      />
                      <span className="absolute left-2 top-1.5 text-xs text-gray-400">%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-3 bg-rose-50 p-6 rounded-3xl border border-rose-100">
              <div className="flex justify-between text-gray-600">
                <span>إجمالي الضرائب:</span>
                <span className="font-bold">{totalTaxAmount.toFixed(2)} {currency}</span>
              </div>
              <div className="flex justify-between text-2xl font-extrabold text-rose-700 pt-2 border-t border-rose-200">
                <span>الإجمالي النهائي:</span>
                <span>{finalTotal.toFixed(2)} {currency}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}