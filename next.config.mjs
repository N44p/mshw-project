/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml', // الرابط الذي يطلبه جوجل (لا تغيره)
        destination: '/sitemap', // اسم المجلد الذي أنشأته (app/sitemap)
      },
    ];
  },
};

export default nextConfig;
