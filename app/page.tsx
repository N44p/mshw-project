"use client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import {
  Calendar, Clock, Flag, Percent, Briefcase, FileText, 
  Coins, QrCode, CheckSquare, Wallet,
  // استيراد أيقونات الأدوات الجديدة
  Gauge, BookOpen, Activity, Ruler, Lock, RefreshCw
} from "lucide-react"

const tools = [
  {
    href: "/date-converter",
    title: "محول التاريخ والعمر",
    description: "تحويل بين التاريخ الميلادي والهجري وحساب العمر بدقة",
    icon: Calendar, color: "text-black", bgColor: "bg-emerald-100",
  },
  {
    href: "/salary-dates",
    title: "الرواتب والدعم",
    description: "مواعيد صرف الرواتب، حساب المواطن، والضمان الاجتماعي",
    icon: Wallet, color: "text-black", bgColor: "bg-violet-100",
  },
  {
    href: "/calendar-display", // أداة جديدة
    title: "التقويم اليومي",
    description: "عرض التاريخ الهجري والميلادي لليوم بشكل مباشر",
    icon: Calendar, color: "text-black", bgColor: "bg-blue-100",
  },
  {
    href: "/prayer-times",
    title: "مواقيت الصلاة",
    description: "حساب مواقيت الصلاة بناءً على موقعك الجغرافي",
    icon: Clock, color: "text-black", bgColor: "bg-sky-100",
  },
  {
    href: "/internet-speed", // أداة جديدة
    title: "فحص السرعة",
    description: "اختبار سرعة اتصالك بالإنترنت والـ Ping",
    icon: Gauge, color: "text-black", bgColor: "bg-slate-100",
  },
  {
    href: "/athkar", // أداة جديدة
    title: "الأذكار",
    description: "أذكار الصباح والمساء مع عداد رقمي بسيط",
    icon: BookOpen, color: "text-black", bgColor: "bg-green-100",
  },
  {
    href: "/currency-converter",
    title: "محول العملات",
    description: "أسعار صرف العملات العالمية والعربية لحظة بلحظة",
    icon: Coins, color: "text-black", bgColor: "bg-amber-100",
  },
  {
    href: "/calories-calculator", // أداة جديدة
    title: "حاسبة السعرات",
    description: "حساب السعرات اليومية المطلوبة لجسمك بدقة",
    icon: Activity, color: "text-black", bgColor: "bg-orange-100",
  },
  {
    href: "/vat-calculator",
    title: "حاسبة الضرائب",
    description: "حساب ضريبة القيمة المضافة والضرائب المخصصة",
    icon: Percent, color: "text-black", bgColor: "bg-rose-100",
  },
  {
    href: "/size-converter", // أداة جديدة
    title: "محول القياسات",
    description: "تحويل مقاسات الأحذية والملابس بين الأنظمة العالمية",
    icon: Ruler, color: "text-black", bgColor: "bg-pink-100",
  },
  {
    href: "/password-generator", // أداة جديدة
    title: "مولد كلمات السر",
    description: "إنشاء كلمات مرور قوية ومعقدة بضغطة زر",
    icon: Lock, color: "text-black", bgColor: "bg-gray-200",
  },
  {
    href: "/unit-converter", // أداة جديدة
    title: "محول الوحدات",
    description: "تحويل الأوزان، الأطوال، والمساحات بسهولة",
    icon: RefreshCw, color: "text-black", bgColor: "bg-cyan-100",
  },
  {
    href: "/document-scanner",
    title: "ماسح المستندات",
    description: "مسح المستندات وتحويلها إلى PDF باستخدام الكاميرا",
    icon: FileText, color: "text-black", bgColor: "bg-teal-100",
  },
  {
    href: "/qr-tool",
    title: "رموز QR",
    description: "توليد وقراءة رموز الـ QR بسهولة وسرعة",
    icon: QrCode, color: "text-black", bgColor: "bg-purple-100",
  },
  {
    href: "/end-of-service",
    title: "مكافأة الخدمة",
    description: "حساب مكافأة نهاية الخدمة وفق قوانين العمل",
    icon: Briefcase, color: "text-black", bgColor: "bg-indigo-100",
  },
  {
    href: "/tasks",
    title: "قائمة المهام",
    description: "نظم وقتك ومهامك اليومية بفاعلية",
    icon: CheckSquare, color: "text-black", bgColor: "bg-orange-100",
  },
  {
    href: "/national-events",
    title: "المناسبات الوطنية",
    description: "الإجازات والمناسبات الرسمية للدول العربية",
    icon: Flag, color: "text-black", bgColor: "bg-red-100",
  },
]

export default function HomePage() {
  return (
    <DashboardLayout title={"\u00A0\u00A0\u00A0" + "لوحة الأدوات الذكية 2026"} description="كل ما تحتاجه في مكان واحد بتصميم عصري">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href}>
            <Card className="h-full transition-all duration-300 hover:shadow-2xl cursor-pointer group border-2 border-gray-100 bg-white">
              <CardHeader>
                <div className={`w-14 h-14 rounded-2xl ${tool.bgColor} flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
                  <tool.icon className={`h-7 w-7 ${tool.color}`} />
                </div>
                <CardTitle className="text-xl font-extrabold text-gray-900">{tool.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed text-gray-700 font-medium">
                  {tool.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  )
}