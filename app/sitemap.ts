import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mofed.vercel.app'
  const tools = [
    '',
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

  return tools.map((tool) => ({
    url: `${baseUrl}${tool}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: tool === '' ? 1 : 0.8,
  }))
}