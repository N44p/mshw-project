import type { Metadata, Viewport } from 'next'
import { Tajawal } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['200', '300', '400', '500', '700', '800', '900'],
  variable: '--font-tajawal',
})

export const metadata: Metadata = {
  // هذا هو العنوان الذي يظهر في جوجل إذا لم تكن الصفحة الفرعية تملك عنواناً خاصاً
  title: {
    default: 'مفيد | أدوات ذكية في مكان واحد',
    template: '%s | موقع مفيد' // هذا سيجعل العناوين الفرعية تظهر كـ "الأذكار | موقع مفيد"
  },
  description: 'منصة مفيد تقدم مجموعة أدوات تقنية مجانية: مواقيت الصلاة، تحويل عملات، حاسبات صحية، مواعيد الرواتب، وتطوير إنتاجي بتصميم سريع وسهل.',
  keywords: [
    "مفيد", "مواقيت الصلاة", "موعد الرواتب", "حساب المواطن", "تحويل عملات", 
    "أذكار الصباح والمساء", "حاسبة السعرات", "حاسبة الضرائب", "ماسح QR", 
    "تحويل التاريخ", "سرعة الإنترنت", "كلمات السر", "محول الوحدات"
  ],
  authors: [{ name: 'مفيد - Mofeed' }],
  verification: {
    google: 'ITVUAwRB8nkd8PrPKjnfbbcobFZwve56eN9Qs4Gq-nA', 
  },
  icons: {
    icon: '/icon.svg?v=1',
    apple: '/icon.svg?v=1',
    shortcut: '/icon.svg',
  },
  openGraph: {
    title: 'موقع مفيد - أدواتك اليومية بذكاء',
    description: 'استخدم أدوات احترافية مجاناً: من مواقيت الصلاة إلى حساب الرواتب والضرائب.',
    siteName: 'مفيد',
    locale: 'ar_SA',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#0F172A',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className={`${tajawal.variable} font-sans antialiased`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
