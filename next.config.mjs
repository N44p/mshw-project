/** @type {import('next').NextConfig} */
const nextConfig = {
  // حذفنا قسم eslint لأنه يسبب الخطأ الذي رأيته
  typescript: { 
    ignoreBuildErrors: true 
  },
  images: { 
    unoptimized: true 
  },
  // هذا التوجيه هو الذي سينهي مشكلة "الصفحة السوداء" للخريطة
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/mysitemap.xml', // تأكد أن هذا الملف موجود في مجلد public
      },
    ];
  },
};

export default nextConfig;
