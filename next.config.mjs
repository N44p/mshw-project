/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/sitemap.xml/route',
      },
      {
        source: '/robots.txt',
        destination: '/robots.txt/route', // إذا كنت ستستخدم Route Handler للروبوتس أيضاً
      },
    ];
  },
};

export default nextConfig;
