export default function sitemapXml() {
  const baseUrl = 'https://mofed.vercel.app';

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
  ];

  const urls = routes.map((route) => `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  `).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}