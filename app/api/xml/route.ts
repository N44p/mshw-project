import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic'; // إجبار السيرفر على عدم التخزين

export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org"><url><loc>https://mofed.vercel.app</loc></url></urlset>`;
  return new NextResponse(xml, { 
    headers: { 
      'Content-Type': 'application/xml',
      'Cache-Control': 'no-store, max-age=0' 
    } 
  });
}
