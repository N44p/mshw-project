export default function sitemap() {
  const baseUrl = 'https://mofed.vercel.app'

  const routes = [
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

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }))
}