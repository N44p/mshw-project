import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mofed.vercel.app'
  
  // هذه هي المسارات من ملف page.tsx الخاص بك
  const routes = [
    '',
    '/date-converter',
    '/salary-dates',
    '/calendar-display',
    '/prayer-times',
    '/internet-speed',
    '/athkar',
    '/currency-converter',
    '/calories-calculator',
    '/vat-calculator',
    '/size-converter',
    '/password-generator',
    '/unit-converter',
    '/document-scanner',
    '/qr-tool',
    '/end-of-service',
    '/tasks',
    '/national-events',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }))
}
