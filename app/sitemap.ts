import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mofed.vercel.app'

  // قائمة جميع الأدوات الـ 17 بناءً على مجلداتك
  const tools = [
    '', // الصفحة الرئيسية
    '/athkar',
    '/calendar-display',
    '/calories-calculator',
    '/currency-converter',
    '/date-converter',
    '/document-scanner',
    '/end-of-service',
    '/internet-speed',
    '/national-events',
    '/password-generator',
    '/prayer-times',
    '/qr-tool',
    '/salary-dates',
    '/size-converter',
    '/tasks',
    '/unit-converter',
    '/vat-calculator',
  ]

  const routes = tools.map((tool) => ({
    url: `${baseUrl}${tool}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: tool === '' ? 1.0 : 0.8,
  }))

  return routes
}