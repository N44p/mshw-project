/** @type {import('next').NextConfig} */
const nextConfig = {
  // منع إضافة "/" تلقائياً التي تكسر روابط الملفات
  trailingSlash: false,
  
  // السماح برفع الموقع حتى لو وجد أخطاء بسيطة
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  
  images: { unoptimized: true },

  // إجبار النظام على قراءة الملفات من مجلد public مباشرة
  async rewrites() {
    return [
      {
        source: '/robots.txt',
        destination: '/robots.txt',
      },
      {
        source: '/sitemap.xml',
        destination: '/mysitemap.xml',
      },
    ];
  },
};

export default nextConfig;
