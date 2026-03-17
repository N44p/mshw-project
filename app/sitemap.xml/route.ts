import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://mofed.vercel.app';
  
  // قائمة جميع الأدوات الـ 17
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
  ];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${tools.map(tool => `
  <url>
    <loc>${baseUrl}${tool}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${tool === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
</urlset>`;

  return new NextResponse(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
    },
  });
}