import { NextResponse } from 'next/server';

export async function GET() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org">
  <url>
    <loc>https://mofed.vercel.app</loc>
    <lastmod>2026-03-17</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://mofed.vercel.appathkar</loc>
    <lastmod>2026-03-17</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://mofed.vercel.appsalary-dates</loc>
    <lastmod>2026-03-17</lastmod>
    <priority>0.8</priority>
  </url>
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
