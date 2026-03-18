/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { 
    ignoreBuildErrors: true 
  },
  images: { 
    unoptimized: true 
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/app/sitemap', // الملف موجود داخل مجلد app
      },
    ];
  },
};

export default nextConfig;