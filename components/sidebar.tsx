"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Home,
  Calendar,
  Clock,
  Flag,
  Percent,
  Briefcase,
  FileText,
  Menu,
  X,
  Wallet,
  // استيراد أيقونات الأدوات الجديدة
  Gauge,
  BookOpen,
  Activity,
  Ruler,
  Lock,
  RefreshCw,
} from "lucide-react"

const navItems = [
  {
    href: "/",
    label: "الرئيسية",
    icon: Home,
  },
  {
    href: "/salary-dates",
    label: "الرواتب والدعم",
    icon: Wallet,
  },
  {
    href: "/calendar-display", // أداة جديدة
    label: "التقويم اليومي",
    icon: Calendar,
  },
  {
    href: "/date-converter",
    label: "محول التاريخ",
    icon: Calendar,
  },
  {
    href: "/prayer-times",
    label: "مواقيت الصلاة",
    icon: Clock,
  },
  {
    href: "/internet-speed", // أداة جديدة
    label: "فحص السرعة",
    icon: Gauge,
  },
  {
    href: "/athkar", // أداة جديدة
    label: "الأذكار",
    icon: BookOpen,
  },
  {
    href: "/calories-calculator", // أداة جديدة
    label: "حاسبة السعرات",
    icon: Activity,
  },
  {
    href: "/size-converter", // أداة جديدة
    label: "محول القياسات",
    icon: Ruler,
  },
  {
    href: "/password-generator", // أداة جديدة
    label: "مولد كلمات السر",
    icon: Lock,
  },
  {
    href: "/unit-converter", // أداة جديدة
    label: "محول الوحدات",
    icon: RefreshCw,
  },
  {
    href: "/national-events",
    label: "المناسبات الوطنية",
    icon: Flag,
  },
  {
    href: "/vat-calculator",
    label: "حاسبة الضريبة",
    icon: Percent,
  },
  {
    href: "/end-of-service",
    label: "مكافأة نهاية الخدمة",
    icon: Briefcase,
  },
  {
    href: "/document-scanner",
    label: "ماسح المستندات",
    icon: FileText,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 right-0 z-40 h-screen w-64 bg-sidebar border-l border-sidebar-border transition-transform duration-300 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <h1 className="text-xl font-bold text-sidebar-foreground">
              لوحة الأدوات
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              أدوات عربية متكاملة
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-primary shadow-sm"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <p className="text-xs text-muted-foreground text-center">
              جميع الحقوق محفوظة © 2026
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}