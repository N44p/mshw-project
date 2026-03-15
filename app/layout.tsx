import type { Metadata, Viewport } from 'next'
import { Tajawal } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['200', '300', '400', '500', '700', '800', '900'],
  variable: '--font-tajawal',
})

export const metadata: Metadata = {
  title: 'مفيد | أدوات ذكية في مكان واحد',
  description: 'منصة "مفيد" الشاملة: مواقيت الصلاة، مواعيد الرواتب في 12 دولة عربية، حاسبة الضرائب، صانع وماسح QR، ومحول التاريخ.',
  keywords: [
    "مفيد", "مواقيت الصلاة", "موعد الرواتب", "حساب المواطن", "تكافل وكرامة", 
    "رواتب السعودية", "رواتب مصر", "رواتب الكويت", "رواتب الإمارات", "رواتب الأردن"
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
  themeColor: '#0F172A', // لون فخم يتناسب مع الهوية الجديدة
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
      </body>
    </html>
  )
}